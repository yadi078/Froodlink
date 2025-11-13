# 🔐 GUÍA DE CONFIGURACIÓN SSL/TLS PARA FOODLINK

Esta guía te ayudará a configurar HTTPS para el proyecto FoodLink.

---

## 📋 ÍNDICE

1. [Desarrollo Local (Certificado Autofirmado)](#desarrollo-local)
2. [Producción (Let's Encrypt)](#producción-lets-encrypt)
3. [Configuración Apache](#configuración-apache)
4. [Configuración Nginx](#configuración-nginx)
5. [Verificación y Pruebas](#verificación)
6. [Troubleshooting](#troubleshooting)

---

## 🏠 DESARROLLO LOCAL

### Opción 1: Certificado Autofirmado con OpenSSL

#### Paso 1: Generar Certificado

**Windows (PowerShell como Administrador):**

```powershell
# Navegar al directorio de Apache
cd C:\xampp\apache

# Generar certificado autofirmado (válido por 365 días)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout conf\ssl.key\localhost.key `
  -out conf\ssl.crt\localhost.crt `
  -subj "/C=MX/ST=Estado/L=Ciudad/O=FoodLink/CN=localhost"
```

**Linux/Mac:**

```bash
# Crear directorios si no existen
sudo mkdir -p /etc/ssl/private
sudo mkdir -p /etc/ssl/certs

# Generar certificado
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/localhost.key \
  -out /etc/ssl/certs/localhost.crt \
  -subj "/C=MX/ST=Estado/L=Ciudad/O=FoodLink/CN=localhost"
```

#### Paso 2: Configurar Apache (XAMPP)

**Editar `C:\xampp\apache\conf\extra\httpd-ssl.conf`:**

```apache
# Buscar y modificar estas líneas:

Listen 443

<VirtualHost _default_:443>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost:443
    ServerAlias www.localhost
    
    # SSL Engine
    SSLEngine on
    
    # Certificados
    SSLCertificateFile "C:/xampp/apache/conf/ssl.crt/localhost.crt"
    SSLCertificateKeyFile "C:/xampp/apache/conf/ssl.key/localhost.key"
    
    # Configuración SSL moderna
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLHonorCipherOrder on
    
    <Directory "C:/xampp/htdocs">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Habilitar módulo SSL en `C:\xampp\apache\conf\httpd.conf`:**

Descomentar estas líneas (quitar el `#`):

```apache
LoadModule ssl_module modules/mod_ssl.so
Include conf/extra/httpd-ssl.conf
LoadModule socache_shmcb_module modules/mod_socache_shmcb.so
```

#### Paso 3: Reiniciar Apache

```bash
# XAMPP Control Panel: Stop y Start Apache
# O desde línea de comandos:
net stop Apache2.4
net start Apache2.4
```

#### Paso 4: Aceptar Certificado en el Navegador

1. Abre `https://localhost/foodlink`
2. Verás advertencia de seguridad (normal para certificados autofirmados)
3. Haz clic en "Avanzado" > "Continuar a localhost (no seguro)"
4. El certificado quedará guardado en tu navegador

### Opción 2: mkcert (Más Fácil)

**Herramienta recomendada para desarrollo local:**

```powershell
# Windows (con Chocolatey)
choco install mkcert

# Instalar certificados raíz
mkcert -install

# Generar certificado para localhost
cd C:\xampp\apache
mkcert -key-file conf\ssl.key\localhost.key -cert-file conf\ssl.crt\localhost.crt localhost 127.0.0.1 ::1
```

**Linux:**

```bash
# Ubuntu/Debian
sudo apt install mkcert
mkcert -install
sudo mkcert -key-file /etc/ssl/private/localhost.key -cert-file /etc/ssl/certs/localhost.crt localhost 127.0.0.1 ::1
```

**Ventaja:** No habrá advertencias de seguridad en el navegador.

---

## 🌐 PRODUCCIÓN - LET'S ENCRYPT

### Prerrequisitos

- Dominio registrado apuntando a tu servidor
- Servidor con IP pública
- Puerto 80 y 443 abiertos en firewall

### Apache (Ubuntu/Debian)

```bash
# 1. Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-apache

# 2. Obtener certificado (reemplaza tudominio.com)
sudo certbot --apache -d foodlink.tudominio.com -d www.foodlink.tudominio.com

# 3. Responder las preguntas:
#    - Email: tu@email.com
#    - Aceptar términos: Yes
#    - Compartir email: No
#    - Redirigir HTTP a HTTPS: Yes (opción 2)

# 4. Renovación automática (ya está configurada)
sudo certbot renew --dry-run
```

### Apache (CentOS/RHEL)

```bash
sudo yum install certbot python3-certbot-apache
sudo certbot --apache -d foodlink.tudominio.com
```

---

## ⚙️ CONFIGURACIÓN APACHE MANUAL

### VirtualHost HTTP (Puerto 80)

**Crear `/etc/apache2/sites-available/foodlink.conf`:**

```apache
<VirtualHost *:80>
    ServerName foodlink.tudominio.com
    ServerAlias www.foodlink.tudominio.com
    
    # Redirigir todo a HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
```

### VirtualHost HTTPS (Puerto 443)

**Crear `/etc/apache2/sites-available/foodlink-ssl.conf`:**

```apache
<VirtualHost *:443>
    ServerName foodlink.tudominio.com
    ServerAlias www.foodlink.tudominio.com
    
    DocumentRoot /var/www/foodlink
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/foodlink.tudominio.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/foodlink.tudominio.com/privkey.pem
    
    # SSL Security (A+ en SSLLabs)
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    
    # HSTS (15768000 segundos = 6 meses)
    Header always set Strict-Transport-Security "max-age=15768000; includeSubDomains"
    
    <Directory /var/www/foodlink>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/foodlink-error.log
    CustomLog ${APACHE_LOG_DIR}/foodlink-access.log combined
</VirtualHost>
```

**Habilitar sitio:**

```bash
sudo a2ensite foodlink.conf
sudo a2ensite foodlink-ssl.conf
sudo a2enmod ssl
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl reload apache2
```

---

## 🔧 CONFIGURACIÓN NGINX

### Configuración Completa

**Crear `/etc/nginx/sites-available/foodlink`:**

```nginx
# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name foodlink.tudominio.com www.foodlink.tudominio.com;
    
    return 301 https://$server_name$request_uri;
}

# Configuración HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name foodlink.tudominio.com www.foodlink.tudominio.com;
    
    root /var/www/foodlink;
    index index.html index.php;
    
    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/foodlink.tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/foodlink.tudominio.com/privkey.pem;
    
    # SSL Configuration (A+ en SSLLabs)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    
    # SSL Session Cache
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=15768000; includeSubDomains" always;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # PHP Configuration
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }
    
    # API Routes
    location /api/ {
        try_files $uri $uri/ /api/index.php?$query_string;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Habilitar configuración:**

```bash
sudo ln -s /etc/nginx/sites-available/foodlink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ VERIFICACIÓN

### 1. Verificar que HTTPS funciona

```bash
# Probar conexión HTTPS
curl -I https://localhost/foodlink/api/
curl -I https://tudominio.com/foodlink/api/

# Debería retornar: HTTP/2 200 (o HTTP/1.1 200)
```

### 2. Verificar Headers de Seguridad

```bash
curl -I https://tudominio.com/foodlink/api/ | grep -i "strict-transport"
# Debería mostrar: Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 3. Pruebas en Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Verifica que todas las peticiones usen `https://`
5. Busca el ícono de candado 🔒 en la barra de direcciones

### 4. Herramientas Online

**SSL Labs** (calificación de seguridad):
```
https://www.ssllabs.com/ssltest/analyze.html?d=tudominio.com
```
Meta: Obtener calificación A o A+

**Security Headers** (verificar headers):
```
https://securityheaders.com/?q=tudominio.com
```

---

## 🔧 ACTIVAR REDIRECCIÓN HTTPS EN PHP

Una vez que SSL esté configurado, **descomentar** en `api/config.php`:

```php
// Forzar HTTPS en producción
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
```

---

## 🐛 TROUBLESHOOTING

### Error: "SSL: No such file or directory"

**Solución:**
```bash
# Verificar que los archivos existen
ls -la /etc/ssl/certs/localhost.crt
ls -la /etc/ssl/private/localhost.key

# Verificar permisos
sudo chmod 644 /etc/ssl/certs/localhost.crt
sudo chmod 600 /etc/ssl/private/localhost.key
```

### Error: "Invalid certificate chain"

**Causa:** Falta certificado intermedio

**Solución:**
```bash
# Let's Encrypt genera fullchain.pem que incluye la cadena completa
# Usar fullchain.pem en lugar de cert.pem
SSLCertificateFile /etc/letsencrypt/live/domain/fullchain.pem
```

### Error: "Mixed Content" en navegador

**Causa:** La página carga recursos con `http://`

**Solución:**
```javascript
// Cambiar en todos los archivos .js:
const API_URL = "https://tudominio.com/foodlink/api"

// O usar URLs relativas:
const API_URL = "/foodlink/api"
```

### Apache no inicia después de habilitar SSL

```bash
# Ver errores detallados
sudo apache2ctl configtest
sudo systemctl status apache2

# Errores comunes:
# 1. Módulo SSL no habilitado
sudo a2enmod ssl

# 2. Puerto 443 en uso
sudo netstat -tulpn | grep :443
sudo lsof -i :443
```

### Certificado Let's Encrypt no se renueva

```bash
# Ver logs de renovación
sudo cat /var/log/letsencrypt/letsencrypt.log

# Renovar manualmente
sudo certbot renew --force-renewal

# Verificar cron job
sudo systemctl list-timers | grep certbot
```

---

## 📱 CONFIGURACIÓN PARA DESARROLLO MÓVIL

### Android (React Native)

**Permitir certificados autofirmados en desarrollo:**

```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">localhost</domain>
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </domain-config>
</network-security-config>
```

**Referenciar en AndroidManifest.xml:**

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### iOS (React Native)

**Permitir conexiones a localhost en desarrollo:**

```xml
<!-- ios/FoodLink/Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>localhost</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

**IMPORTANTE:** Remover esto en producción.

---

## 📚 RECURSOS ADICIONALES

### Documentación Oficial

- **Let's Encrypt:** https://letsencrypt.org/docs/
- **Certbot:** https://certbot.eff.org/
- **Mozilla SSL Config Generator:** https://ssl-config.mozilla.org/

### Validadores Online

- **SSL Labs Test:** https://www.ssllabs.com/ssltest/
- **Security Headers:** https://securityheaders.com/
- **Why No Padlock:** https://www.whynopadlock.com/

### Mejores Prácticas

- **OWASP Transport Layer Protection:** https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html
- **Mozilla Web Security Guidelines:** https://infosec.mozilla.org/guidelines/web_security

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

```markdown
### Desarrollo Local
- [ ] Instalar OpenSSL o mkcert
- [ ] Generar certificado autofirmado
- [ ] Configurar Apache/Nginx para SSL
- [ ] Cambiar URLs a https:// en archivos JS
- [ ] Probar en navegador (https://localhost/foodlink)
- [ ] Aceptar certificado en navegador

### Producción
- [ ] Registrar dominio
- [ ] Configurar DNS apuntando al servidor
- [ ] Instalar Certbot
- [ ] Obtener certificado Let's Encrypt
- [ ] Configurar renovación automática
- [ ] Habilitar redirección HTTP → HTTPS en config.php
- [ ] Cambiar URLs a dominio real en JS
- [ ] Probar con SSL Labs (objetivo: A+)
- [ ] Verificar headers de seguridad
- [ ] Configurar CORS restrictivo en producción

### Aplicación Móvil
- [ ] Actualizar URLs en firebase.js
- [ ] Probar conexión desde app móvil
- [ ] Remover excepciones de seguridad en producción
```

---

## 🎯 PRÓXIMOS PASOS

Después de implementar SSL/TLS:

1. **Actualizar CORS** en `api/config.php`:
   ```php
   // Cambiar de:
   header('Access-Control-Allow-Origin: *');
   
   // A (en producción):
   header('Access-Control-Allow-Origin: https://tudominio.com');
   ```

2. **Habilitar Content Security Policy (CSP)**

3. **Configurar certificado SSL pinning** en app móvil (avanzado)

4. **Implementar rate limiting** en API

---

**¡Tu aplicación ahora estará protegida con HTTPS! 🔐**

Para cualquier duda, consulta la documentación oficial o los recursos adicionales listados arriba.

---

**Última actualización:** Noviembre 2025

