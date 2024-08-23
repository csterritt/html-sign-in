export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const sleepWithJitter = async (timeToSleep: number) =>
  sleep(timeToSleep + Math.random() * 10)
