export default () => ({

    categories: ['A', 'B', 'C'],

    A: {
        requiredSpace: 1,
        dayTariff: 3,
        nightTariff: 2,
    },

    B: {
        requiredSpace: 2,
        dayTariff: 6,
        nightTariff: 4,
    },

    C: {
        requiredSpace: 3,
        dayTariff: 12,
        nightTariff: 8,
    },

    discounts: ['silver', 'gold', 'platinum', 'none'],

    none: 0,
    silver: 10,
    gold: 15,
    platinum: 20,

    dayStart: 8,
    nightStart: 18,

    millisecondsInDay: 86400000

    //MONGODB_URI: 'mongodb+srv://Lab08:u0OcqEUBZTXgBRa8@cluster0.83zms.mongodb.net/Lab08Garage?retryWrites=true&w=majority'
    
});