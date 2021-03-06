import { render, screen, fireEvent, getByLabelText } from '@testing-library/vue'
import CreateForm from '@/components/CreateForm.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import axios from 'axios'

Vue.use(Vuetify)

jest.mock('axios')

axios.post.mockImplementation((url) => {
  console.log(url)
  switch (url) {
    case 'https://devo2.hxydra.hxtech.org/kondo/v1/enrollmenttype/':
      return Promise.resolve({data: [{"name":"audit"},{"name":"flipped"},{"name":"limited"},{"name":"open"},{"name":"other"},{"name":"spoc"}]})
    default:
      console.log('Error', url)
      return Promise.reject(new Error('not found'))
  }
})

describe('CreateForm.vue', () => {
  let wrapper
  beforeEach(() => {
    const breakpoint = {
      init: jest.fn(),
      framework: {},
      smAndDown: true,
    }
    const vuetify = new Vuetify()
    vuetify.framework.breakpoint = breakpoint
    wrapper = render(CreateForm, {
      vuetify,
    })
  })

  it('loaded form inputs', async () => {
    // make sure all inputs exist first
    let prefix = screen.getByLabelText('Project Prefix')
    let vno = screen.getByLabelText('Version Number')
    let rno = screen.getByLabelText('Rerun Number')
    let cno = screen.getByLabelText('Part of a sequence?')
    await fireEvent.click(cno)
    let sno = screen.getByLabelText('Sequence Number')
    screen.getByLabelText('Project Name')
    screen.getByLabelText('Exact Launch Date')
    screen.getByLabelText('Exact End Date')
    screen.getByLabelText('Approximate Launch & End Date')
  })

  it('calculates nickname', async () => {
    // get items that change nickname
    let prefix = screen.getByLabelText('Project Prefix')
    let vno = screen.getByLabelText('Version Number')
    let rno = screen.getByLabelText('Rerun Number')
    let cno = screen.getByLabelText('Part of a sequence?')
    await fireEvent.click(cno)
    let sno = screen.getByLabelText('Sequence Number')

    // change some values to test the automatic nickname maker
    await fireEvent.update(prefix, 'Test')
    await fireEvent.update(sno, 15)
    screen.getByText(/Test_15_v1_r00/)

    await fireEvent.update(prefix, 'TestX')
    await fireEvent.update(sno, 3)
    screen.getByText(/TestX_03_v1_r00/)
  })

  it('checks for sequence number', async () => {
    let cno = screen.getByLabelText('Part of a sequence?')
    await fireEvent.click(cno)
    let sno = screen.getByLabelText('Sequence Number')
    await fireEvent.update(sno, '')
    await Vue.nextTick()
    screen.getByText(/start at 1/i)
    await fireEvent.update(sno, 1)
    await Vue.nextTick()
    // to finish up later
  })

  it('checks the nickname parts are set properly', async () => {
    const localThis = {
      prefix: 'TEST1',
      sequence_num: 1,
      version: 1,
      run: 0
    }
    expect(CreateForm.computed.nickname.call(localThis)).toBe('TEST1_01_v1_r00')

    const highNums = {
      prefix: 'TEST2',
      sequence_num: 15,
      version: 11,
      run: 10
    }
    expect(CreateForm.computed.nickname.call(highNums)).toBe('TEST2_15_v11_r10')
  })

  it('check successful create', async () => {
    // TODO: check how to test this via external API
    
    // let prefix = screen.getByLabelText('Project Prefix')
    // let cno = screen.getByLabelText('Part of a sequence?')
    // await fireEvent.click(cno)
    // let sno = screen.getByLabelText('Sequence Number')
    // await fireEvent.update(prefix, 'AUTO1')
    // await fireEvent.update(sno, 1)
    // let prna = screen.getByLabelText('Project Name')
    // await fireEvent.update(prna, 'Test Auto')
    // let apda = screen.getByLabelText('Approximate Launch & End Date')
    // await fireEvent.update(apda, 'Soon')
    // let submit_button = screen.getByText('Create')
    // await fireEvent.click(submit_button)
    

  })
})