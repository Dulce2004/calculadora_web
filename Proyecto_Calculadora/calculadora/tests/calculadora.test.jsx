/* eslint-env jsdom */
/* global describe, test, expect, beforeEach */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculadora from '../src/components/calculadora';

describe('Calculadora', () => {
  beforeEach(() => {
    render(<Calculadora />);
  });

  test('muestra los números presionados en el display', () => {
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('789');
  });

  test('limpia el display al presionar una operación y luego un número', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('3');
  });

  test('muestra el resultado al presionar una operación dos veces', () => {
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('4'); // 2 + 2 = 4
  });

  test('muestra ERROR si el resultado es negativo', () => {
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '-' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('ERROR');
  });

  test('muestra ERROR si el número es mayor a 999999999', () => {
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: '9' }));
    }
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('999999999');
  });

  test('el botón C limpia el display y resetea el estado', () => {
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('0');
  });

  test('no muestra más de 9 dígitos en el display', () => {
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
    }
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('111111111');
  });

  test('realiza división correctamente y muestra hasta 9 caracteres', () => {
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('3.1428571');
  });

  test('muestra ERROR al dividir por cero', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('ERROR');
  });

  test('trunca resultados decimales largos a 9 caracteres', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('0.3333333');
  });

  test('permite agregar punto decimal', () => {
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(screen.getByTestId('display')).toHaveTextContent('3.1');
  });

  test('no permite múltiples puntos decimales', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByTestId('display')).toHaveTextContent('5.2');
  });

  test('maneja decimales en resultados largos', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('0.3333333'); 
  });

  test('no excede 9 caracteres con decimales', () => {
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: '1' }));
    }
    expect(screen.getByTestId('display')).toHaveTextContent('0.1111111'); 
  });

  test('realiza operación módulo correctamente', () => {
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '%' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('1');
  });

  test('muestra ERROR en módulo por cero', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '%' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('ERROR');
  });

  test('maneja módulo con decimales', () => {
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '%' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    expect(screen.getByTestId('display')).toHaveTextContent('1.5'); 
  });

  
});
