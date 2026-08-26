maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'cluster-map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: [78.9629, 20.5937],
    zoom: 3.75
});

map.on('load', async function () {
    map.addSource('campgrounds', {
        type: 'geojson',
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52">
        <path d="M21 1C9.95 1 1 9.95 1 21c0 14.5 20 30 20 30s20-15.5 20-30C41 9.95 32.05 1 21 1Z" fill="#168aad" stroke="#ffffff" stroke-width="2"/>
        <circle cx="21" cy="21" r="7" fill="#ffffff"/>
    </svg>`;
    const pinImage = new Image(42, 52);
    pinImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(pinSvg)}`;
    await new Promise((resolve, reject) => {
        pinImage.onload = resolve;
        pinImage.onerror = reject;
    });
    map.addImage('listing-pin', pinImage);

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
            // with three steps to implement three types of circles:
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#00BCD4',
                10,
                '#2196F3',
                30,
                '#2d73b0ff',
                90,
                '#00ff77ff',
                150,
                '#f25b5bff'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10,
                20,
                30,
                25,
                90,
                30,
                150,
                35,

            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        layout: {
            'icon-image': 'listing-pin',
            'icon-size': 0.75,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('campgrounds').getClusterExpansionZoom(clusterId);
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    const openPointPopup = function (e) {
        const feature = e.features[0];
        const { properties = {} } = feature;
        const popUpMarkup = properties.popUpMarkup ||
            `<div class="map-popup-card"><p class="map-popup-title">${properties.title || 'Listing'}</p><p class="map-popup-location">${properties.location || ''}</p><a class="map-popup-link" href="/listings/${feature.id}">View listing <span aria-hidden="true">→</span></a></div>`;
        const coordinates = feature.geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup()
            .setLngLat(coordinates)
            .setHTML(popUpMarkup)
            .addTo(map);
    };

    map.on('click', 'unclustered-point', openPointPopup);
    map.on('mouseenter', 'unclustered-point', openPointPopup);

    map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});