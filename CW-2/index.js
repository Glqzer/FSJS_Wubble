function calcWakeUpTimes() {
  const fallAsleepTime = new Date();
  fallAsleepTime.setMinutes(fallAsleepTime.getMinutes() + 14);
  console.log(
    "You will fall sleep at",
    fallAsleepTime.toLocaleTimeString("en-US", {
      timeStyle: "short",
    })
  );

  const wakeUpTimesDiv = document.getElementById("wakeup-hours-div");

  const wakeUpTime = new Date(fallAsleepTime);

  wakeUpTimesDiv.innerHTML = "";
  for (let i = 1; i <= 6; i++) {
    wakeUpTime.setMinutes(wakeUpTime.getMinutes() + 90);
    const wakeUpTimeString = wakeUpTime.toLocaleTimeString("en-US", {
      timeStyle: "short",
    });

    const sleepCycleDiv = document.createElement("div");
    sleepCycleDiv.setAttribute("id", `cycle-${i}`);
    sleepCycleDiv.classList.add(`cycle`);
    sleepCycleDiv.textContent = wakeUpTimeString;

    wakeUpTimesDiv.appendChild(sleepCycleDiv);
  }
}

const calcBtn = document.getElementById("calc-btn");
calcBtn.onclick = calcWakeUpTimes;