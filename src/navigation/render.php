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

$ref = isset($attributes['ref']) ? esc_attr($attributes['ref']) : '';
?>

<div class="hjarts-blocks-ts-navigation-root" data-mytest="{'testdata':'thisismytest data'}" data-ref="<?php echo $ref ?>"></div>