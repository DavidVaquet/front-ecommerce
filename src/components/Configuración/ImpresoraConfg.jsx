import React, { useState, useEffect } from 'react';
import { Button, Select, Option, Card, Typography, Alert } from '@material-tailwind/react';
import printService from '../../services/printService';

export default function ConfiguracionImpresora() {
  const [impresoras, setImpresoras] = useState([]);
  const [impresoraSeleccionada, setImpresoraSeleccionada] = useState('');
  const [conectado, setConectado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const impresoraGuardada = printService.getDefaultPrinter();
    if (impresoraGuardada) {
      setImpresoraSeleccionada(impresoraGuardada);
    }
  }, []);

  const buscarImpresoras = async () => {
    setCargando(true);
    setError('');
    try {
      const lista = await printService.getPrinters();
      setImpresoras(lista);
      setConectado(true);
      
      if (lista.length === 0) {
        setError('No se encontraron impresoras. Verifica que estén instaladas y encendidas.');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message);
      setConectado(false);
    } finally {
      setCargando(false);
    }
  };

  const guardarImpresora = () => {
    if (impresoraSeleccionada) {
      printService.setDefaultPrinter(impresoraSeleccionada);
      alert('✅ Impresora configurada correctamente');
    } else {
      alert('⚠️ Selecciona una impresora primero');
    }
  };

  const imprimirPrueba = async () => {
    if (!impresoraSeleccionada) {
      alert('⚠️ Primero selecciona y guarda una impresora');
      return;
    }

    const productoPrueba = {
      codigoBarras: '1234567890128',
      nombre: 'PRODUCTO DE PRUEBA',
      precio: '99.99',
      stock: 10
    };

    setCargando(true);
    try {
      // Cambia según tu tipo de impresora:
      await printService.imprimirEtiquetaNormal(productoPrueba);
      // await printService.imprimirEtiquetaZebra(productoPrueba);
      
      alert('✅ Etiqueta de prueba enviada a imprimir');
    } catch (error) {
      alert('❌ Error al imprimir: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <Typography variant="h5" className="mb-4">
        🖨️ Configuración de Impresora
      </Typography>

      {error && (
        <Alert color="red" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <strong>Instrucciones:</strong>
          <ol className="list-decimal ml-4 mt-2 space-y-1">
            <li>Asegúrate de que QZ Tray esté instalado y ejecutándose en tu PC</li>
            <li>Haz clic en "Buscar Impresoras"</li>
            <li>Selecciona tu impresora de etiquetas</li>
            <li>Guarda la configuración</li>
            <li>Prueba con "Imprimir Prueba"</li>
          </ol>
        </div>

        <Button 
          onClick={buscarImpresoras} 
          loading={cargando}
          color="blue"
          fullWidth
        >
          {conectado ? '🔄 Reconectar' : '🔍 Buscar Impresoras'}
        </Button>

        {impresoras.length > 0 && (
          <>
            <Select
              label="Seleccionar Impresora"
              value={impresoraSeleccionada}
              onChange={(val) => setImpresoraSeleccionada(val)}
            >
              {impresoras.map((impresora) => (
                <Option key={impresora} value={impresora}>
                  {impresora}
                </Option>
              ))}
            </Select>

            <div className="flex gap-2">
              <Button 
                onClick={guardarImpresora} 
                color="green"
                disabled={!impresoraSeleccionada}
                className="flex-1"
              >
                💾 Guardar Configuración
              </Button>
              
              <Button 
                onClick={imprimirPrueba} 
                color="amber"
                loading={cargando}
                disabled={!impresoraSeleccionada}
                className="flex-1"
              >
                🖨️ Imprimir Prueba
              </Button>
            </div>

            {impresoraSeleccionada && (
              <Alert color="green">
                Impresora seleccionada: <strong>{impresoraSeleccionada}</strong>
              </Alert>
            )}
          </>
        )}
      </div>
    </Card>
  );
}