import '@testing-library/jest-dom';
import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToolWrapper from '../src/components/ToolWrapper';
import { loadTool } from '../src/components/toolsRegistry/toolRegistry';

jest.mock('../src/components/toolsRegistry/toolRegistry', () => ({
  loadTool: jest.fn(),
}));

describe('ToolWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading message while tool is being loaded', async () => {
    loadTool.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <Suspense fallback={<div>Chargement de l'outil...</div>}>
        <ToolWrapper toolId="mockTool" />
      </Suspense>
    );
    expect(screen.getByText("Chargement de l'outil...")).toBeInTheDocument();
  });

  test('renders tool component correctly', async () => {
    const MockTool = () => <div>Mock Tool Component</div>;
    loadTool.mockResolvedValue(MockTool);

    render(
      <Suspense fallback={<div>Chargement de l'outil...</div>}>
        <ToolWrapper toolId="mockTool" />
      </Suspense>
    );

    // Attend que le composant soit chargé
    const toolComponent = await screen.findByText('Mock Tool Component');
    expect(toolComponent).toBeInTheDocument();
  });

  test('passes props to tool component', async () => {
    const MockTool = ({ testProp }) => <div>{testProp}</div>;
    loadTool.mockResolvedValue(MockTool);

    render(
      <Suspense fallback={<div>Chargement de l'outil...</div>}>
        <ToolWrapper toolId="mockTool" testProp="Test Value" />
      </Suspense>
    );

    const toolComponent = await screen.findByText('Test Value');
    expect(toolComponent).toBeInTheDocument();
  });
});