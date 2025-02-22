<?php

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generates a unique id for aria-controls.
$unique_id = wp_unique_id('p-');

// Adds the global state.
wp_interactivity_state(
	'hjarts-blocks-ts/navigation',
	array(
		'isDark'    => false,
		'darkText'  => esc_html__('Switch to Light', 'kiroart-blocks-ts'),
		'lightText' => esc_html__('Switch to Dark', 'kiroart-blocks-ts'),
	)
);
$post_title = 'HJARTS_NAVIGATION_V1_DEFAULT';
$post_type = 'hjarts_navigation';
$ref = isset($attributes['ref']) ? esc_attr($attributes['ref']) : '';
$existing_posts = get_posts(array(
	'title'      => $post_title,
	'post_type'  => $post_type,
	'post_status' => 'any',
	'numberposts' => 1, // Only check for existence
));
$default_navigation_menu_post_id = !empty($existing_posts) ? $existing_posts[0]->ID : null;
$default_navigation_menu = null;
if ($default_navigation_menu_post_id) {
	$navigation_menu_meta = get_post_meta($default_navigation_menu_post_id, 'navigation_menu', true);
	$default_navigation_menu = is_array($navigation_menu_meta)
		? esc_attr(json_encode($navigation_menu_meta, JSON_UNESCAPED_UNICODE))
		: null;
}
?>

<div class="hjarts-blocks-ts-navigation-root" data-mytest="{'testdata':'thisismytest data'}" data-ref="<?php echo $ref ?>" data-default-navigation-menu-id="<?php echo $default_navigation_menu_post_id ?>" data-default-navigation-menu="<?php echo $default_navigation_menu ?>"></div>