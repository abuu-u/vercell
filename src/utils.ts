const decimalAdjust = (
  type: 'floor' | 'round' | 'ceil',
  value: number,
  exp: number,
) => {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value)
  }

  value = +value
  exp = +exp
  // If the value is not a number or the exp is not an integer...
  if (Number.isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }
  // Shift
  let valueTxt = value.toString().split('e')
  value = Math[type](
    +`${valueTxt[0]}e${valueTxt[1] ? +valueTxt[1] - exp : -exp}`,
  )
  // Shift back
  valueTxt = value.toString().split('e')
  return +`${valueTxt[0]}e${valueTxt[1] ? +valueTxt[1] + exp : exp}`
}

export const decimalRound = (value: number, exp: number) =>
  decimalAdjust('round', value, exp)

export const secondsTommss = (seconds: number): string => {
  const isMinute = seconds > 60
  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60

  return `${isMinute ? (mm < 10 ? `0${mm}` : mm) : '00'}:${
    isMinute
      ? ss < 10
        ? `0${ss}`
        : ss
      : seconds < 10
      ? `0${seconds}`
      : seconds
  }`
}
