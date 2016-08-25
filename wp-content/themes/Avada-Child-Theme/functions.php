<?php

add_filter( 'woocommerce_enqueue_styles', '__return_false' );

function theme_enqueue_styles() {
    wp_enqueue_style( 'avada-parent-stylesheet', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

function avada_lang_setup() {
	$lang = get_stylesheet_directory() . '/languages';
	load_child_theme_textdomain( 'Avada', $lang );
}
add_action( 'after_setup_theme', 'avada_lang_setup' );


add_filter( 'woocommerce_enqueue_styles', 'dequeue_woocommerce_general_stylesheet' );
function dequeue_woocommerce_general_stylesheet( $enqueue_styles ) {
	unset( $enqueue_styles['woocommerce-general'] );	
	return $enqueue_styles;
}

function woocommerce_style_sheet() {
wp_register_style( 'woocommerce', get_stylesheet_directory_uri() . '/woocommerce/woocommerce.css' );
if ( class_exists( 'woocommerce' ) ) {
wp_enqueue_style( 'woocommerce' );
	}
}
add_action('wp_enqueue_scripts', 'woocommerce_style_sheet');