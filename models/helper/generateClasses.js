const Class = require('../Class.js');

(async() => {
    const weekdays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const schedules = ['09:00:00', '10:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '18:00:00', '20:00:00'];

    weekdays.map((weekday) => {
        schedules.map((schedule) => {
            Class.create({
                weekday: weekday.toUpperCase(),
                schedule: schedule
            }).catch(function(err) {
                console.log(err);
            })
        })
    })
})()