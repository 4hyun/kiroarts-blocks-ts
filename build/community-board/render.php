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
$unique_id = wp_unique_id( 'p-' );

// Adds the global state.
wp_interactivity_state(
	'kiroart-blocks-ts/community-board',
	array(
		'isDark'    => false,
		'darkText'  => esc_html__( 'Switch to Light', 'kiroart-blocks-ts' ),
		'lightText' => esc_html__( 'Switch to Dark', 'kiroart-blocks-ts' ),
		'themeText'	=> esc_html__( 'Switch to Dark', 'kiroart-blocks-ts' ),
	)
);
$props = esc_attr(json_encode($attributes));
$context = array('isOpen' => false);

echo sprintf('<div data-wp-interactive="kiroart-blocks-ts/community-board" class="community-board-block-root">%1$s</div>', $content)
?>

<div>community-board-block render</div>


