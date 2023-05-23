const firstWheelStartElement =
  document.querySelector<HTMLSelectElement>('#first-wheel-start')
const secondWheelStartElement = document.querySelector<HTMLSelectElement>(
  '#second-wheel-start'
)
const thirdWheelStartElement =
  document.querySelector<HTMLSelectElement>('#third-wheel-start')

const firstWheelDirectionElement = document.querySelector<HTMLSelectElement>(
  '#first-wheel-direction'
)
const secondWheelDirectionElement = document.querySelector<HTMLSelectElement>(
  '#second-wheel-direction'
)
const thirdWheelDirectionElement = document.querySelector<HTMLSelectElement>(
  '#third-wheel-direction'
)

const firstWheelDistanceElement = document.querySelector<HTMLSelectElement>(
  '#first-wheel-distance'
)
const secondWheelDistanceElement = document.querySelector<HTMLSelectElement>(
  '#second-wheel-distance'
)
const thirdWheelDistanceElement = document.querySelector<HTMLSelectElement>(
  '#third-wheel-distance'
)

const firstSetOuterElement =
  document.querySelector<HTMLInputElement>('#first-set-outer')
const secondSetOuterElement =
  document.querySelector<HTMLInputElement>('#second-set-outer')
const thirdSetOuterElement =
  document.querySelector<HTMLInputElement>('#third-set-outer')

const firstSetMiddleElement =
  document.querySelector<HTMLInputElement>('#first-set-middle')
const secondSetMiddleElement =
  document.querySelector<HTMLInputElement>('#second-set-middle')
const thirdSetMiddleElement =
  document.querySelector<HTMLInputElement>('#third-set-middle')

const firstSetInnerElement =
  document.querySelector<HTMLInputElement>('#first-set-inner')
const secondSetInnerElement =
  document.querySelector<HTMLInputElement>('#second-set-inner')
const thirdSetInnerElement =
  document.querySelector<HTMLInputElement>('#third-set-inner')

const firstSetSolution = document.querySelector<HTMLSpanElement>(
  '#first-set-solution'
)
const secondSetSolution = document.querySelector<HTMLSpanElement>(
  '#second-set-solution'
)
const thirdSetSolution = document.querySelector<HTMLSpanElement>(
  '#third-set-solution'
)

const solveButton = document.querySelector<HTMLButtonElement>('#solve-button')

const isSolved = (
  firstWheelState: number,
  secondWheelState: number,
  thirdWheelState: number
) => {
  return (
    firstWheelState % 6 === 0 &&
    secondWheelState % 6 === 0 &&
    thirdWheelState % 6 === 0
  )
}

interface Solution {
  firstSetSpins: number
  secondSetSpins: number
  thirdSetSpins: number
}

interface SetChange {
  firstWheelAffected: boolean
  secondWheelAffected: boolean
  thirdWheelAffected: boolean
}

interface SetWheelMap {
  firstWheelChange: number
  secondWheelChange: number
  thirdWheelChange: number
}

const MAX_ATTEMPTS = 7

const getSpinChange = (direction: string, distance: number) => {
  return direction === 'right' ? distance : -distance
}

const getWheelChanges = (
  setChange: SetChange,
  setWheelMap: SetWheelMap
): SetWheelMap => {
  return {
    firstWheelChange: setChange.firstWheelAffected
      ? setWheelMap.firstWheelChange
      : 0,
    secondWheelChange: setChange.secondWheelAffected
      ? setWheelMap.secondWheelChange
      : 0,
    thirdWheelChange: setChange.thirdWheelAffected
      ? setWheelMap.thirdWheelChange
      : 0,
  }
}

solveButton?.addEventListener('click', () => {
  const firstWheelState = Number(firstWheelStartElement?.value) ?? 0
  const secondWheelState = Number(secondWheelStartElement?.value) ?? 0
  const thirdWheelState = Number(thirdWheelStartElement?.value) ?? 0

  const solutions: Solution[] = []

  const firstSetChange: SetChange = {
    firstWheelAffected: (firstSetOuterElement as any).checked,
    secondWheelAffected: (firstSetMiddleElement as any).checked,
    thirdWheelAffected: (firstSetInnerElement as any).checked,
  }
  const secondSetChange: SetChange = {
    firstWheelAffected: (secondSetOuterElement as any).checked,
    secondWheelAffected: (secondSetMiddleElement as any).checked,
    thirdWheelAffected: (secondSetInnerElement as any).checked,
  }
  const thirdSetChange: SetChange = {
    firstWheelAffected: (thirdSetOuterElement as any).checked,
    secondWheelAffected: (thirdSetMiddleElement as any).checked,
    thirdWheelAffected: (thirdSetInnerElement as any).checked,
  }

  const firstWheelSpinChange = getSpinChange(
    firstWheelDirectionElement?.value ?? 'right',
    Number(firstWheelDistanceElement?.value) ?? 1
  )
  const secondWheelSpinChange = getSpinChange(
    secondWheelDirectionElement?.value ?? 'right',
    Number(secondWheelDistanceElement?.value) ?? 1
  )
  const thirdWheelSpinChange = getSpinChange(
    thirdWheelDirectionElement?.value ?? 'right',
    Number(thirdWheelDistanceElement?.value) ?? 1
  )

  const wheelChangeMap: SetWheelMap = {
    firstWheelChange: firstWheelSpinChange,
    secondWheelChange: secondWheelSpinChange,
    thirdWheelChange: thirdWheelSpinChange,
  }

  const firstSetWheelMap = getWheelChanges(firstSetChange, wheelChangeMap)
  const secondSetWheelMap = getWheelChanges(secondSetChange, wheelChangeMap)
  const thirdSetWheelMap = getWheelChanges(thirdSetChange, wheelChangeMap)

  for (let firstSetSpins = 0; firstSetSpins < MAX_ATTEMPTS; firstSetSpins++) {
    for (
      let secondSetSpins = 0;
      secondSetSpins < MAX_ATTEMPTS;
      secondSetSpins++
    ) {
      for (
        let thirdSetSpins = 0;
        thirdSetSpins < MAX_ATTEMPTS;
        thirdSetSpins++
      ) {
        const updatedFirstWheelState =
          firstWheelState +
          firstSetSpins * firstSetWheelMap.firstWheelChange +
          secondSetSpins * secondSetWheelMap.firstWheelChange +
          thirdSetSpins * thirdSetWheelMap.firstWheelChange

        const updatedSecondWheelState =
          secondWheelState +
          firstSetSpins * firstSetWheelMap.secondWheelChange +
          secondSetSpins * secondSetWheelMap.secondWheelChange +
          thirdSetSpins * thirdSetWheelMap.secondWheelChange

        const updatedThirdWheelState =
          thirdWheelState +
          firstSetSpins * firstSetWheelMap.thirdWheelChange +
          secondSetSpins * secondSetWheelMap.thirdWheelChange +
          thirdSetSpins * thirdSetWheelMap.thirdWheelChange

        const isSolution = isSolved(
          updatedFirstWheelState,
          updatedSecondWheelState,
          updatedThirdWheelState
        )

        if (isSolution) {
          solutions.push({ firstSetSpins, secondSetSpins, thirdSetSpins })
        }
      }
    }
  }

  if (solutions.length === 0) {
    alert(
      'No solutions found. Did you enter all wheel and set information correctly?'
    )
    return
  }

  solutions.sort((firstSolution, secondSolution) => {
    const firstSolutionRotations =
      firstSolution.firstSetSpins +
      firstSolution.secondSetSpins +
      firstSolution.thirdSetSpins
    const secondSolutionRotations =
      secondSolution.firstSetSpins +
      secondSolution.secondSetSpins +
      secondSolution.thirdSetSpins

    return firstSolutionRotations - secondSolutionRotations
  })

  const bestSolution = solutions[0]

  firstSetSolution!.textContent = bestSolution.firstSetSpins.toString()
  secondSetSolution!.textContent = bestSolution.secondSetSpins.toString()
  thirdSetSolution!.textContent = bestSolution.thirdSetSpins.toString()
})
