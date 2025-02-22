<?php

/**
 * Plugin Name:       HJArts Custom Blocks Collection with Typescript React
 * Description:       HJArts Custom Blocks
 * Version:           0.1.1
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Hyun
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       kiroart-blocks-ts
 *
 * @package           kiroart-blocks-ts
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function hjarts_blocks_ts_hjarts_blocks_ts_block_init()
{
	error_log('register_hjarts_navigation_cpt() is executing. 111');
	register_block_type_from_metadata(__DIR__ . '/build/navigation');
	register_block_type_from_metadata(__DIR__ . '/build/community-board-item');
	register_block_type_from_metadata(__DIR__ . '/build/community-board');
}
add_action('init', 'hjarts_blocks_ts_hjarts_blocks_ts_block_init');

function register_hjarts_navigation_cpt()
{
	register_post_type('hjarts_navigation', array(
		'labels'        => array(
			'name'          => _x('HJArts Custom Navigations', 'hjarts custom navigation post type general name.'),
			'singular_name' => _x('HJArts Custom Navigation', 'hjarts custom navigation post type singular name. '),
		),
		'public'        => false,
		'show_in_rest'  => true, // Enables REST API support
		'supports'      => array('title', 'editor', 'custom-fields'),
	));
	register_post_meta('hjarts_navigation', 'navigation_menu_id', array('type' => 'string', 'single' => true, 'show_in_rest' => true));
	register_post_meta('hjarts_navigation', 'navigation_menu', array('type' => 'string', 'single' => true, 'show_in_rest' => true));
}
add_action('init', 'register_hjarts_navigation_cpt');

// Function to insert default hjarts_navigation post with JSON data during activation
function insert_default_hjarts_navigation()
{
	// Get the JSON file path
	$json_file_path = plugin_dir_path(__FILE__) . 'data/default-menu.json';

	// Check if file exists before reading
	if (!file_exists($json_file_path)) {
		error_log("[ERROR] [hjarts:plugin/init] Required default menu JSON file not found: $json_file_path");
		deactivate_plugins(plugin_basename(__FILE__));
		wp_die("[ERROR] [hjarts:plugin/init] Plugin activation failed: required default menu JSON file not found.");
	}

	// Read JSON file content
	$json_data = file_get_contents($json_file_path);

	// Decode JSON into PHP array
	$menu_data = json_decode($json_data, true); // true -> associative array

	if ($menu_data === null) {
		error_log("[ERROR] [hjarts:plugin/init] JSON decoding failed for default navigation menu.");
		deactivate_plugins(plugin_basename(__FILE__));
		wp_die("[ERROR] [hjarts:plugin/init] Plugin activation failed: JSON decoding error.");
	}

	$post_title = 'HJARTS_NAVIGATION_V1_DEFAULT';
	$post_type = 'hjarts_navigation';

	// Search for existing post by title
	$existing_posts = get_posts(array(
		'title'      => $post_title,
		'post_type'  => $post_type,
		'post_status' => 'any',
		'numberposts' => 1, // Only check for existence
	));

	if (empty($existing_posts)) { // If no post exists with this title
		// Insert new post
		$post_id = wp_insert_post(array(
			'post_title'   => $post_title,
			'post_status'  => 'publish',
			'post_type'    => $post_type,
			'post_content' => '', // Leave empty if not needed
		));

		if (!is_wp_error($post_id)) {
			// Store directly as an array (not JSON string)
			update_post_meta($post_id, 'navigation_menu', $menu_data);
			update_post_meta($post_id, 'navigation_menu_id', $post_id);
		} else {
			error_log("[ERROR] [hjarts:plugin/init] Something went wrong internally during setup. Plugin will not activate.");
			deactivate_plugins(plugin_basename(__FILE__));
			wp_die("[ERROR] [hjarts:plugin/init] Plugin activation failed: default menu post insertion error.");
		}
	}
}

// Register activation hook (Runs only once when the plugin is activated)
register_activation_hook(__FILE__, 'insert_default_hjarts_navigation');
