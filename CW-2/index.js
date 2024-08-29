const fallAsleepTime = new Date();
fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + 14);
console.log(
  "You will fall sleep at",
  fallAsleepTime.toLocaleTimeString("en-US", {
    timeStyle: "short",
  })
);

const wakeUpTime = new Date(fallAsleepTime);
const wakeUpTimes = [];
for (let i = 1; i <= 6; i++) {
  wakeUpTime.setMinutes(wakeUpTime.getMinutes() + 90);
  const wakeUpTimeString = wakeUpTime.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });
  wakeUpTimes.push(wakeUpTimeString);
}

console.log("Wake-up times:", wakeUpTimes.join(", "));