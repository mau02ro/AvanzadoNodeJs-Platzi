# AvanzadoNodeJs-Platzi

Curso avanzado de NodeJS - Platzi

## Introducción a protocolos y patrones de aplicaciones en tiempo real

### Cómo funciona el modelo Pub/Sub en MQTT y Web Sockets

**Pub/Sub** es un patrón de mensajería, en este modelo se suscribe a un canal en el cual van a enviar mensajes y se recibirán notificaciones de los canales que estén suscritos. Al momento de crearse un mensaje la red redistribuirá un mensaje a todos los usuarios que estén suscritos.

Hay protocolos que utilizan este patrón como **MQTT**, este es un es un protocolo de red liviano que transporta mensajes entre dispositivos. El protocolo generalmente se ejecuta sobre **TCP/IP** ; sin embargo, cualquier protocolo de red que proporcione conexiones bidireccionales ordenadas y sin pérdidas puede admitir **MQTT**. Este está diseñado especialmente para aplicaciones limitadas ya sea por ancho de banda o tamaño del mensaje, esto lo hace óptimo para aplicaciones **IOT**.

Otro patrón de comunicación que implementa un sistema similar a **Pub/Sub** es **Web Sockets**, en este el cliente y el servidor van a tener un canal de comunicación bidireccional, la conexión se realiza sobre un único canal **TCP**, para establecer una conexión de **Web Sockets** debe haber un **HANDSHAKE** entre el cliente y servidor, este se hace a través de una conexión **http** para hacer una **update** de la conexión **http** a **Web Sockets**, de este forma puede haber un canal de comunicación hasta que uno de los dos lados decida cerrar el canal.

## Creando Módulo de Base de Datos (platziverse-db)

## Construyendo un servidor en tiempo real para Internet de las Cosas con Mosca/MQT

## Construyendo el agente de monitoreo (platziverse-agent)

## Construyendo una API REST con Express (platziverse-api)

## Asegurando nuestra API REST con JWT

## Creando un Dashboard Web en tiempo real con WebSockets (platziverse-web)

## Creando un Dashboard para la terminal en tiempo real con Blessed (platziverse-cl)

## Depurando Aplicaciones Node.js

## Preparando nuestra aplicación para producción

## Desplegando nuestra aplicación a producción
