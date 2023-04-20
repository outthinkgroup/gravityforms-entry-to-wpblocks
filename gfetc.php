<?php
/**
 * Plugin Name:       GravityForm Entry To Blocks
 * Description:       Pulls in a gravity form entry as headings and paragraph blocks
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gfetc
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
function outthink_gfentry_to_block_init() {
	register_block_type( __DIR__ . '/build/wordcloud' );
	register_block_type( __DIR__ . '/build/gfentry' );
}
add_action( 'init', 'outthink_gfentry_to_block_init' );


/*╭────────────────────╮
  │    [   AJAX   ]    │
  ╰────────────────────╯*/

add_action('wp_ajax_gfetc_get_stars', function(){
	$args = [
		'post_type' =>'star',
		'posts_per_page'=>20,
		'orderby'=> 'date',
		'order'=>'ASC',
		'meta_query'=>[
			[
				'key'=>'starmeta_form_entries',
				'value'=> "i:",
				'compare' => 'LIKE',
			]
		]
	];
	$data = gfetc_json_body();
	$args = [
		'post_type' =>'star',
		'posts_per_page'=>20,
		'orderby'=> 'date',
		'order'=>'ASC',
	];
	if(isset($data['form_id']) && $data['form_id']){
		$fid = intval($data['form_id']);
		$args['meta_query'] =	[
			[
				'key'=>'starmeta_form_entries',
				'value'=> "i:$fid",
				'compare' => 'LIKE',
			]
		];
	}
	if(isset($data['query']) && $data['query']){
		$args['s'] = $data['query'];	
	}
	if(isset($data['limit']) && $data['limit']){
		$args['posts_per_page'] = intval($data['limit']);
	}
	$posts = get_posts($args);
	$stars = array_reduce($posts, function($acc, $p){
		 $star = new Constellations\Stars\StarEntity($p->ID);
		 if(count($star->get_form_entries())){
			$acc[] = $star;
		 }
		 return $acc;
	}, []);

	$stars = array_map(function($star){

		return [
			'email'=>$star->get_email(),
			'name'=>$star->get_name('array'),
			'forms'=>$star->get_form_entries(),
		];
	},$stars);

	exit(json_encode($stars));
});

add_action('wp_ajax_gfetc_forms', function (){
 	exit(json_encode(\GFAPI::get_forms()));
});

add_action('wp_ajax_gfetc_gf_entries', function (){
	$data = gfetc_json_body();
	$form_id = $data['form_id'];
 	exit(json_encode(\GFAPI::get_entries($form_id)));
});
add_action('wp_ajax_gfetc_gf_answers', function (){
    $data = gfetc_json_body();
    ['form_id'=>$form_id, 'question_id'=>$question_id] = $data;
    global $wpdb;
    $sql = $wpdb->prepare("
    SELECT entry_id, meta_value 
    FROM 
        {$wpdb->prefix}gf_entry_meta
    WHERE
        form_id = %s
    AND
        meta_key = %s
    ", $form_id, $question_id);
    $res = $wpdb->get_results($sql, \ARRAY_A);
    exit(json_encode(array_values($res)));
});

add_action('wp_ajax_gfetc_gf_entry', function (){
	$data = gfetc_json_body();
	$entry_id = $data['entry_id'];
 	exit(json_encode(\GFAPI::get_entry($entry_id)));
});

function gfetc_json_body(){
	$json = file_get_contents("php://input");
	$data = json_decode($json,true);
	return $data;
}

