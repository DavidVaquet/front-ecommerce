import qz from 'qz-tray';
import { sha256 } from 'js-sha256'; // npm install js-sha256

// Importa tus certificados (guárdalos en /public/certificates/)
const CERTIFICATE = import.meta.env.REACT_APP_QZ_CERTIFICADO;

const PRIVATE_KEY = import.meta.env.REACT_APP_QZ_PRIVATE_KEY;

class PrintService {
  constructor() {
    this.connected = false;
    this.defaultPrinter = null;
  }

  setSecurity() {
    qz.security.setCertificatePromise(function(resolve) {
      resolve(CERTIFICATE);
    });

    qz.security.setSignatureAlgorithm("SHA512");
    qz.security.setSignaturePromise(function(toSign) {
      return function(resolve, reject) {
        try {
          const signature = sha256(toSign);
          resolve(signature);
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  // Conectar con QZ Tray
  async connect() {
    if (this.connected) return true;

    try {
      this.setSecurity();
      await qz.websockets.connect();
      this.connected = true;
      console.log('✅ Conectado a QZ Tray');
      return true;
    } catch (error) {
      console.error('❌ Error conectando a QZ Tray:', error);
      throw new Error('No se pudo conectar con QZ Tray. Asegúrate de que esté instalado y ejecutándose.');
    }
  }

  // Desconectar
  async disconnect() {
    if (!this.connected) return;
    
    try {
      await qz.websockets.disconnect();
      this.connected = false;
      console.log('Desconectado de QZ Tray');
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  }

  async getPrinters() {
    await this.connect();
    const printers = await qz.printers.find();
    console.log('Impresoras disponibles:', printers);
    return printers;
  }

  // Configurar impresora por defecto
  setDefaultPrinter(printerName) {
    this.defaultPrinter = printerName;
    localStorage.setItem('defaultPrinter', printerName);
  }

  // Obtener impresora por defecto
  getDefaultPrinter() {
    if (this.defaultPrinter) return this.defaultPrinter;
    return localStorage.getItem('defaultPrinter');
  }

  // Imprimir etiqueta con código de barras (formato ZPL para Zebra)
  async imprimirEtiquetaZebra(producto) {
    await this.connect();

    const printerName = this.getDefaultPrinter();
    if (!printerName) {
      throw new Error('No hay impresora configurada');
    }

    const config = qz.configs.create(printerName);

    // Comando ZPL para impresora Zebra
    const zpl = `
        ^XA
        ^CF0,30
        ^FO50,50^BY2
        ^BCN,100,Y,N,N
        ^FD${producto.barcode}^FS
        ^FO50,170^A0N,25,25^FD${producto.nombre}^FS
        ^FO50,240^A0N,18,18^FDStock: ${producto.cantidad}^FS
        ^XZ
    `;

    try {
      await qz.print(config, [zpl]);
      console.log('✅ Etiqueta impresa correctamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      throw error;
    }
  }

}

export default new PrintService();