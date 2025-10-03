// src/services/printService.js
const CERTIFICATE = import.meta.env.REACT_APP_QZ_CERTIFICADO;
const PRIVATE_KEY = import.meta.env.REACT_APP_QZ_PRIVATE_KEY;

class PrintService {
  constructor() {
    this.connected = false;
    this.defaultPrinter = null;
    this.qz = null;
  }

  // Inicializar QZ desde el objeto global window
  initQZ() {
    if (typeof window !== 'undefined' && window.qz) {
      this.qz = window.qz;
      return true;
    }
    return false;
  }

  setSecurity() {
    if (!this.initQZ()) {
      throw new Error('QZ Tray no está cargado');
    }

    this.qz.security.setCertificatePromise((resolve) => {
      resolve(CERTIFICATE);
    });

    this.qz.security.setSignatureAlgorithm("SHA512");
    
    this.qz.security.setSignaturePromise((toSign) => {
      return (resolve, reject) => {
        try {
          // Usar CryptoJS del CDN
          if (window.CryptoJS) {
            const hash = window.CryptoJS.SHA512(toSign + PRIVATE_KEY);
            resolve(hash.toString());
          } else {
            // Fallback simple
            resolve(toSign);
          }
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  async connect() {
    if (this.connected) return true;

    try {
      if (!this.initQZ()) {
        throw new Error('QZ Tray no está disponible. Asegúrate de que el script esté cargado.');
      }

      // Verificar que websockets existe
      if (!this.qz.websockets) {
        throw new Error('QZ Tray websockets no disponible');
      }

      this.setSecurity();
      
      // Verificar si ya está conectado
      const isActive = await this.qz.websockets.isActive();
      
      if (!isActive) {
        console.log('Conectando a QZ Tray...');
        await this.qz.websockets.connect();
      }
      
      this.connected = true;
      console.log('✅ Conectado a QZ Tray');
      
      return true;
    } catch (error) {
      console.error('❌ Error conectando a QZ Tray:', error);
      
      // Mensaje más específico según el error
      if (error.message.includes('websocket')) {
        throw new Error('QZ Tray no está ejecutándose. Por favor, inicia la aplicación QZ Tray.');
      } else {
        throw new Error('Error al conectar: ' + error.message);
      }
    }
  }

  async disconnect() {
    if (!this.connected || !this.qz) return;
    
    try {
      const isActive = await this.qz.websockets.isActive();
      if (isActive) {
        await this.qz.websockets.disconnect();
      }
      this.connected = false;
      console.log('Desconectado de QZ Tray');
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  }

  async getPrinters() {
    await this.connect();
    const printers = await this.qz.printers.find();
    console.log('Impresoras disponibles:', printers);
    return printers;
  }

  setDefaultPrinter(printerName) {
    this.defaultPrinter = printerName;
    localStorage.setItem('defaultPrinter', printerName);
  }

  getDefaultPrinter() {
    if (this.defaultPrinter) return this.defaultPrinter;
    return localStorage.getItem('defaultPrinter');
  }

  async imprimirEtiquetaZebra(producto) {
    await this.connect();

    const printerName = this.getDefaultPrinter();
    if (!printerName) {
      throw new Error('No hay impresora configurada');
    }

    const config = this.qz.configs.create(printerName);

    const zpl = `
^XA
^CF0,30
^FO50,50^BY2
^BCN,100,Y,N,N
^FD${producto.codigoBarras}^FS
^FO50,170^A0N,25,25^FD${producto.nombre}^FS
^FO50,210^A0N,20,20^FDPrecio: $${producto.precio}^FS
^FO50,240^A0N,18,18^FDStock: ${producto.stock || 0}^FS
^XZ
    `;

    try {
      await this.qz.print(config, [zpl]);
      console.log('✅ Etiqueta impresa correctamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      throw error;
    }
  }

  async imprimirEtiquetaNormal(producto) {
    await this.connect();

    const printerName = this.getDefaultPrinter();
    if (!printerName) {
      throw new Error('No hay impresora configurada');
    }

    const config = this.qz.configs.create(printerName);

    const html = `
      <html>
      <head>
        <style>
          body { 
            font-family: Arial; 
            text-align: center;
            padding: 10px;
            width: 4in;
            height: 2in;
          }
          .producto { font-size: 16px; font-weight: bold; margin: 10px 0; }
          .precio { font-size: 14px; margin: 5px 0; }
          .codigo { font-size: 12px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="producto">${producto.nombre}</div>
        <div class="codigo">Código: ${producto.codigoBarras}</div>
        <div class="precio">Precio: $${producto.precio}</div>
        <div>Stock: ${producto.stock || 0}</div>
      </body>
      </html>
    `;

    try {
      await this.qz.print(config, [{
        type: 'html',
        format: 'plain',
        data: html
      }]);
      console.log('✅ Etiqueta impresa correctamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      throw error;
    }
  }
}

export default new PrintService();