<?php
$query_args = array('post_type' => 'community', 'category_name' => 'announcement');
$query      = new WP_Query($query_args);
if (! $query->have_posts()) {
	return 'WP_Query - NO POSTS';
}
$classnames = '';
$wrapper_attributes = get_block_wrapper_attributes(array('class' => trim($classnames)));
$content = '';
$key_value_pairs = [];
while ($query->have_posts()) {
	$query->the_post();
	// Wrap the render inner blocks in a `li` element with the appropriate post classes.
	// $post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );
	$post_classes = 'hj-community-board-item'. ' community-board-item'.' community-board-item-'. $post_id;;

	$inner_block_directives = $enhanced_pagination ? ' data-wp-key="community-board-item-' . $post_id . '"' : '';

	$key_value_pairs[get_the_ID()] = get_the_title();
	$content .= '<li' . $inner_block_directives . ' class="' . esc_attr($post_classes) . '">' . '<div>' . get_the_title() . '</div>' . '</li>';
}

wp_reset_postdata();

 $block->context['keyValuePairs'] = $key_value_pairs;

echo sprintf(
	'<ul %1$s>%2$s</ul>',
	$wrapper_attributes,
	$content
);

// echo '<div class="community-board-item-root"></div>'
?>
