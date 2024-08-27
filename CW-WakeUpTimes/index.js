// First Class Introduction

const fallAsleepTime = new Date(); // Object Creation
fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + 14); // Add 14 Minutes to current time
const config = {
    timeStyle: "short"
};
console.log("Fall Asleep: ", fallAsleepTime.toLocaleTimeString("en-US", config))

const wakeUpTime = new Date(fallAsleepTime); // Object creation, not pointer
const wakeUpTimes = []; // Empty Array

for (let i = 1; i <= 6; i++) {
    wakeUpTime.setMinutes(wakeUpTime.getMinutes() + 90);
    const wakeUpTimeString = wakeUpTime.toLocaleTimeString("en-US", config);
    wakeUpTimes.push(wakeUpTimeString); // Add to array
}

console.log('Wake up times are:', wakeUpTimes);