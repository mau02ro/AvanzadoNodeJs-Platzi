# platziverse-mqtt

## `agent/connected`

```js
{
  agent: {
    uuid: /*auto generar*/,
    username:  /*definir por configuración*/,
    name: /*definir por configuración*/,
    hostname: /*obtener del sistema operativo*/,
    pid: /*obtener del proceso*/,
  }
}
```

## `agent/desconnected`

```js
{
  agent: {
    uuid: /*auto generar*/,
  }
}
```

## `agent/message`

```js
{
  agent: {
    uuid: /*auto generar*/,
    username:  /*definir por configuración*/,
    name: /*definir por configuración*/,
    hostname: /*obtener del sistema operativo*/,
    pid: /*obtener del proceso*/,
  },
  metric: [
    {
      type: /**/,
      value: /**/
    }
  ],
  timestamp: /*auto generar*/,
}
```
