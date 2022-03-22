import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  describe('form', () => {
    it('should render a form with a label and input', () => {
      render(<App />);
      const label = screen.getByText(/enter github user/i);
      const input = screen.getByRole('textbox');

      expect(label).toBeVisible();
      expect(input).toBeVisible();
    });

    describe('button', () => {
      let repo;

      beforeAll(() => {
        repo = {
          stargazers_count: 1,
          forks_count: 1,
          html_url: 'https://www.example.com',
          name: 'Repo Name',
          description: 'description',
          id: 1,
        };
        jest.spyOn(window, 'fetch').mockImplementation(() => {
          const fetchResponse = Promise.resolve({ json: () => repo });
          return Promise.resolve(fetchResponse);
        });
      });
      afterAll(() => window.fetch.mockRestore());

      it('should render a disabled button', () => {
        render(<App />);
        const button = screen.getByRole('button');

        expect(button).toBeVisible();
        expect(button).toBeDisabled();
      });

      it('should render an enabled button when input has text', () => {
        render(<App />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');
        userEvent.type(input, 'test');

        expect(button).toBeVisible();
        expect(button).not.toBeDisabled();
      });

      it('should make fetch request when button is clicked', async () => {
        render(<App />);
        window.fetch.mockResolvedValueOnce({
          json: async () => ({
            data: [repo],
          }),
        });

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');
        userEvent.type(input, 'test');
        await act(async () => userEvent.click(button));
        input.value = '';

        expect(window.fetch).toHaveBeenCalledTimes(1);
        expect(input).toHaveValue('');
      });

      it('should render a list of repos when fetch succeeds', async () => {
        render(<App />);
        window.fetch.mockResolvedValueOnce({
          json: async () => ({
            data: [repo],
          }),
        });

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');
        userEvent.type(input, 'test');
        await act(async () => userEvent.click(button));
        input.value = '';

        expect(screen.getByText(/repo/i)).toBeVisible();
      });
    });
  });
});
