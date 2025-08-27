const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6899feb6bf18a76570f465e6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: ' must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [ 
                    cities[random1000].longitude, 
                    cities[random1000].latitude 
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dktywzocf/image/upload/v1755289181/YelpCamp/w1chccuitmamlm6e5njt.jpg',
                    filename: 'YelpCamp/w1chccuitmamlm6e5njt'
                },
                {
                    url: 'https://res.cloudinary.com/dktywzocf/image/upload/v1755289185/YelpCamp/y12u3btbq2m9nmps7ymp.png',
                    filename: 'YelpCamp/y12u3btbq2m9nmps7ymp'
                },
                {
                    url: 'https://res.cloudinary.com/dktywzocf/image/upload/v1755289185/YelpCamp/ujikpg65olvjz24pqhmf.png',
                    filename: 'YelpCamp/ujikpg65olvjz24pqhmf'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})