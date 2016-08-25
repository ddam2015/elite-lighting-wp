<?php
# Database Configuration
define( 'DB_NAME', 'wp_elitelighting' );
define( 'DB_USER', 'elitelighting' );
define( 'DB_PASSWORD', 'qYoY7PHu5Bhau7Y1UL6o' );
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_HOST_SLAVE', '127.0.0.1' );
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         'RGKUWB9~Eh_EtpV$ZU8>/!DyK~WkuB|E<%q}GS$Fm,sz9---J`HyFv@w5cZtQ`XO');
define('SECURE_AUTH_KEY',  '-J18`=tjLiC|*onTlK-DMY$2d!G3I|,$yiGnG{]</r`RY-GT$75F^*B+-FiUf;`G');
define('LOGGED_IN_KEY',    'k3-,9Ez}~-.|w~cJnFW`=>gWD)BC<a7P/WE@w:;A}5<}|zuca+2u%jSy^@qjt`N=');
define('NONCE_KEY',        'J=W0.X<=eVIZTXi/WfL*$b,xWZSskK^4WXb+c$I;UbIa7w`hGuvd|8r1sDJH|h7x');
define('AUTH_SALT',        'C1fD-S4<v1>|od4bP,l v8st*RTxdJz9!bt}?0V.j#=v8If{Vz=G<?O?f+u^%/x=');
define('SECURE_AUTH_SALT', 'r+o~k)Nt[IA%U)fNH^p*HT(<,9lGN6h<S9J5U|U8+L/E(|4UZ6PM}|ad/wD3|-mp');
define('LOGGED_IN_SALT',   '8fg}XP0[6_y/``7/Z9F(ipq`S_ F)`IP,<CM#Z&TiN@Tnk|s+A8 T>KJfVAd&St~');
define('NONCE_SALT',       'qx_7a*?TQ]6tP+AZM2SOt@wf-Iq#!g;+@oE+V<v}jdt3^bXi[Dkc2nuaB?Gn1+LY');


# Localized Language Stuff

define( 'WP_CACHE', TRUE );

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'elitelighting' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'PWP_ROOT_DIR', '/nas/wp' );

define( 'WPE_APIKEY', '9370bd425c5346b09eec78cda1f73cf46e54eba3' );

define( 'WPE_CLUSTER_ID', '100107' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_SFTP_PORT', 2222 );

define( 'WPE_LBMASTER_IP', '104.154.107.214' );

define( 'WPE_CDN_DISABLE_ALLOWED', true );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'elitelighting.wpengine.com', );

$wpe_varnish_servers=array ( 0 => 'pod-100107', );

$wpe_special_ips=array ( 0 => '104.154.107.214', );

$wpe_ec_servers=array ( );

$wpe_largefs=array ( );

$wpe_netdna_domains=array ( );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( );


# WP Engine ID


# WP Engine Settings




// define( 'REVISR_GIT_DIR', dirname( __FILE__ ) );
define('REVISR_GIT_PATH', 'https://github.com/ddam2015/elite-lighting-wp.git'); // Added by Revisr
// define('REVISR_WORK_TREE', '/home/develitewp/public_html/');
define('REVISR_GIT_PATH', 'https://github.com/ddam2015/elite-lighting-wp.git'); // Added by Revisr
define('WP_MEMORY_LIMIT', '256M');
define('WP_TEMP_DIR', '/nas/content/live/elitelighting/wp-content/uploads');
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_DEBUG', false);

# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');
require_once(ABSPATH . 'wp-settings.php');

$_wpe_preamble_path = null; if(false){}
