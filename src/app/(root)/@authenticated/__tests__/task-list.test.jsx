import { TaskList } from '@/components/task-list'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

const mockHandleComplete = jest.fn()

describe('TaskList', () => {
  it('should render "Du har inga uppgifter" when there is no tasks in the array', () => {
    render(<TaskList tasks={[]} handleComplete={mockHandleComplete}/>)
    const message = screen.getByText('Du har inga uppgifter')
    expect(message).toBeInTheDocument()
  })
})
