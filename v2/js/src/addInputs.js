!(function($) {
	function AddInputs( $elt, $mturkForm ) {
		this.$main = $elt;
		this.$mturkForm = $mturkForm;
		this.$pageNumber = $( '.page-number [data-current-page]' );
		this.inp = 'input';
		this.inpNum = 'input[type="number"]';
		this.inpText = 'input[type="text"]';
		this.check = ':checked';
		this.questionContent = '.question-content';
		this.tokenSliderWrapper = '.token-slider-wrapper';
		this.tokenSlider = '.token-slider';

		// onePic has not been called before
		this.onePicCalled = false;
	}

	AddInputs.prototype = {
		// driver to decide which method of addInpts to call
		updateInputs: function( pageNum ) {
			var $inpts = this.$main.find( this.inp ),
				$tokens = $( this.tokenSliderWrapper );

			// only calls add inputs if there are inputs or tokens on the page
			// other wise the page is a intro title page and should not have inputs added
			if ( $inpts.length !== 0 || $tokens.length !== 0 ) {	
				// if the politician and voting line aren't finished displaying 
				// add the input for two pics
				if ( ( pageNum >= 4 && pageNum <= 8 ) || pageNum === 9 ) {
					this.twoPics();
				} else if ( pageNum >= 12 && pageNum <= 15 ) {
					this.onePic();
				} else if ( pageNum >= 19 && pageNum <= 29 ) {
					this.token( $tokens );
				} else if ( pageNum === 31 ) {
					this.appendAll();
				}
			}
		},

		// append the input that was clicked for two pictures
		twoPics: function() {
			// get the input that is checked
			var $inpts = this.$main.find( this.inp + this.check ),
				name = $inpts.attr( 'name' ) + '-LR', // get the name
				picSide = this.generateHiddenInput( name, $inpts.data( 'indx' ) ); //get the side that was clicked

			// hide the input that was clicked
			$inpts.attr( 'type', 'hidden' );
			// append it to the mturk form
			this.$mturkForm.append( $inpts, picSide );
		},

		// append input result for one pic
		onePic: function() {
			var sideChoice = null,
				$decision = null
				$inpts = null;

			// if this is the first time onePic is called
			if ( !this.onePicCalled ) {
				// get the side of the page that the pres-nominee is on
				// and create hidden input with val to append to mturk data
				sideChoice = this.generateHiddenInput( 'obama-LR', this.$main.find( this.inp + '[id="obama"]').data( 'indx' ) );
				this.onePicCalled = true;
			}

			// get input that was clicked
			$inpts = this.$main.find( this.inp + this.check );
			// clone it so as to keep the pol name on the same side
			$decision = $inpts.clone();
			// remvoe id from decision
			$decision.removeAttr( 'id' );
			$decision.attr('type', 'hidden')
			// append to mturk
			this.$mturkForm.append( $decision, sideChoice );
		},

		// append inputs for tokens
		token: function( $tokens ) {
			// get default slider side
			var sliderSide = $tokens.data( 'side' ), 
				tokenStart = $( this.questionContent ).data('you-own-tokens'),//number of tokens started with
				yourTokenVal = parseInt( $( this.tokenSlider).val() ), // tokens selected 
				tokenOrder = parseInt( this.$pageNumber.text() ) - 17, // starts at 1, 1st token at page 18
				sideInp = this.generateHiddenInput( tokenStart + '_slider_L', sliderSide  ), //create hidden input for default slider side
				keepInp = this.generateHiddenInput( tokenStart + '_keep', yourTokenVal ), // create hiddne input for token amount
				orderInp = this.generateHiddenInput( tokenStart + '_order', tokenOrder ); // create hidden input for token order

			this.$mturkForm.append( sideInp, keepInp, orderInp );
		},

		// append all check inputs, text inputs with a length > 1
		// and number inputs to the mturk Form
		appendAll: function() {
			// get input that was clicked
			var $inpts = this.$main.find( this.inp + this.check ), 
				$numInpts = this.$main.find( this.inpNum ),
				$textInpts = this.$main.find( this.inpText );

			// hide the inputs that are being appended to the mturk form
			$inpts.attr( 'type', 'hidden' );
			$numInpts.attr( 'type', 'hidden' );
			$textInpts.attr( 'type', 'hidden' );

			// textInpt is only for other, only append if it has a value
			if ( $textInpts.val().length > 0 ) {
				this.$mturkForm.append( $textInpts );
			}

			// append inputs to mturk
			this.$mturkForm.append( $inpts, $numInpts );
		},

		// generate a hidden input given a name and value
		generateHiddenInput: function( name, value ) {
			return '<input type="hidden"' + ' name="' + name + '" value="' + value + '" >';
		}
	}

	$.fn.addInputs = function( $mturkForm ) {
		var inpts = new AddInputs( this, $mturkForm );
		return inpts;
	}
})(window.jQuery);