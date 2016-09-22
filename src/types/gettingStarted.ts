interface Props {
  step: string,
  userId: string
}

export class GettingStartedState {

  static steps: [string] = [
    'STEP1_OVERVIEW',
    'STEP2_CREATE_TODO_MODEL',
    'STEP3_CREATE_TEXT_FIELD',
    'STEP4_CREATE_COMPLETED_FIELD',
    'STEP5_GOTO_DATA_TAB',
    'STEP6_ADD_DATA_ITEM_1',
    'STEP7_ADD_DATA_ITEM_2',
    'STEP8_GOTO_GETTING_STARTED',
    'STEP9_WAITING_FOR_REQUESTS',
    'STEP10_DONE',
    'STEP11_SKIPPED',
  ]

  step: string

  progress: number

  private userId: string

  constructor (props: Props) {
    this.userId = props.userId
    this.update(props.step)
  }

  isActive = (): boolean => {
    return this.step !== 'STEP10_DONE' && this.step !== 'STEP11_SKIPPED'
  }

  isCurrentStep = (step: string): boolean => {
    return step === this.step
  }

  update = (step: string): void => {
    const currentStepIndex = GettingStartedState.steps.indexOf(this.step)
    const stepIndex = GettingStartedState.steps.indexOf(step)
    if (currentStepIndex > stepIndex) {
      return
    }

    this.step = step

    switch (step) {
      case 'STEP1_OVERVIEW': this.progress = 0
        break
      case 'STEP2_CREATE_TODO_MODEL': this.progress = 1
        break
      case 'STEP3_CREATE_TEXT_FIELD': this.progress = 1
        break
      case 'STEP4_CREATE_COMPLETED_FIELD': this.progress = 1
        break
      case 'STEP5_GOTO_DATA_TAB': this.progress = 2
        break
      case 'STEP6_ADD_DATA_ITEM_1': this.progress = 2
        break
      case 'STEP7_ADD_DATA_ITEM_2': this.progress = 2
        break
      case 'STEP8_GOTO_GETTING_STARTED': this.progress = 3
        break
      case 'STEP9_WAITING_FOR_REQUESTS': this.progress = 3
        break
      case 'STEP10_DONE': this.progress = 4
        break
      case 'STEP11_SKIPPED': this.progress = 0
        break
    }
  }
}
