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
	register_block_type_from_metadata(__DIR__ . '/build/navigation');
	register_block_type_from_metadata(__DIR__ . '/build/community-board-item');
	register_block_type_from_metadata(__DIR__ . '/build/community-board');
}
add_action('init', 'hjarts_blocks_ts_hjarts_blocks_ts_block_init');

// function kiroart_blocks_ts_enqueue_style_tw_global()
// {
// 	wp_enqueue_style('kiroart-blocks-ts-tw-global', __DIR__ . '/build/pluginTwGlobalImportModule.css');
// }
// add_action('wp_enqueue_scripts', 'kiroart_blocks_ts_enqueue_style_tw_global');
// function kiroart_blocks_ts_add_editor_style_tw_global()
// {
// 	add_editor_style(__DIR__ . '/build/pluginTwGlobalImportModule.css');
// }

// add_action('after_setup_theme', 'kiroart_blocks_ts_add_editor_style_tw_global');
