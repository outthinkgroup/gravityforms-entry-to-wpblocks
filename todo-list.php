<?php
/**
 * Plugin Name:       Todo List
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       todo-list
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_todo_list_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_todo_list_block_init' );

add_action('wp_ajax_gfetc_forms', function (){
 	exit(json_encode(\GFAPI::get_forms()));
});

add_action('wp_ajax_gfetc_gf_entries', function (){
	$data = gftec_json_body();
	$form_id = $data['form_id'];
 	exit(json_encode(\GFAPI::get_entries($form_id)));
});

function gftec_json_body(){
	$json = file_get_contents("php://input");
	$data = json_decode($json,true);
	return $data;
}

