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
		'public'        => true,
		'show_in_rest'  => true, // Enables REST API support
		'supports'      => array('title', 'editor', 'custom-fields'),
	));
	register_post_meta('hjarts_navigation', 'navigation_menu_id', array('type' => 'string', 'single' => true, 'show_in_rest' => true));
	register_post_meta('hjarts_navigation', 'navigation_menu', array('type' => 'string', 'single' => true, 'show_in_rest' => true));
}
add_action('init', 'register_hjarts_navigation_cpt');
