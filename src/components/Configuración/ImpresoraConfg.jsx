import React, { useState, useEffect } from 'react';
import { Button, Select, Option, Card, Typography } from '@material-tailwind/react';
import printService from '../../services/printService';

export default function ConfiguracionImpresora() {
  const [impresoras, setImpresoras] = useState([]);
  const [impresoraSeleccionada, setImpresoraSeleccionada] = useState('');
  const [conectado, setConectado] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const impresoraGuardada = printService.getDefaultPrinter();
    if (impresoraGuardada) {
      setImpresoraSeleccionada(impresoraGuardada);
    }
  }, []);

  const buscarImpresoras = async () => {
    setCargando(true);
    try {
      const lista = await printService.getPrinters();
      setImpresoras(lista);
      setConectado(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const guardarImpresora = () => {
    if (impresoraSeleccionada) {
      printService.setDefaultPrinter(impresoraSeleccionada);
      alert('Impresora configurada correctamente');
    }
  };

  const imprimirPrueba = async () => {
    const productoPrueba = {
      codigoBarras: '1234567890',
      nombre: 'Producto de Prueba',
      precio: '99.99',
      stock: 10
    };

    try {
      // Cambia el método según tu tipo de impresora
      await printService.imprimirEtiquetaZebra(productoPrueba);
      // await printService.imprimirEtiquetaESCPOS(productoPrueba);
      // await printService.imprimirEtiquetaNormal(productoPrueba);
      
      alert('Etiqueta de prueba enviada a imprimir');
    } catch (error) {
      alert('Error al imprimir: ' + error.message);
    }
  };

  return (
    <Card className="p-6">
      <Typography variant="h5" className="mb-4">
        Configuración de Impresora
      </Typography>

      <div className="space-y-4">
        <Button 
          onClick={buscarImpresoras} 
          loading={cargando}
          color="blue"
        >
          {conectado ? 'Reconectar' : 'Buscar Impresoras'}
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
              <Button onClick={guardarImpresora} color="green">
                Guardar Configuración
              </Button>
              
              <Button onClick={imprimirPrueba} color="amber">
                Imprimir Prueba
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}