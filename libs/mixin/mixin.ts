export default {
	onPageScroll(e) {
		uni.$emit('onPageScroll', e.scrollTop)
	},
}