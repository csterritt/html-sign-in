const getRandomInt = (max: number) => Math.floor(Math.random() * max)

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
export const buildSignInCode = (): string => {
  let res = digits[getRandomInt(9)]
  for (let i = 0; i < 5; i += 1) {
    res += digits[getRandomInt(10)]
  }

  return res
}
