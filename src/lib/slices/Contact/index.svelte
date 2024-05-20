<script lang="ts">
	import DefaultButton from "$lib/components/Buttons/DefaultButton.svelte";
import ContentWidth from "$lib/components/ContentWidth.svelte";
import type { ContactSlice } from "../../../prismicio-types";
	export let slice:ContactSlice;
</script>

<style>
	input, select, textarea{
		border-radius: 4px;
		background: #1D1C1C;
		padding:12px;
	}
	input, textarea{
		color:white;
		resize: none;
	}
	input::placeholder, textarea::placeholder, select{
		color:#FFFFFF99;
	}



	button{

font-weight: 500;
line-height: 24px;
text-align: center;
border-radius: 3px;
display: flex;
padding: 10px;
justify-content: center;
align-items: center;
min-width: 160px;
}
@media only screen and (max-width:768px) {
button{
	font-style: normal;
	font-weight: 500;
	text-align: center;
	border-radius: 3px;
	padding: 10px;
}
}
</style>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="h-screen w-screen absolute">
	<ContentWidth class="flex flex-row items-center justify-center mt-48">
		<div class="w-1/3 flex flex-col gap-4">
			<h2 class="text-white mb-4">{slice.primary.header||""}</h2>
			<p class="text-white mb-12">{slice.primary.body||""}</p>
			<div class="button-text text-white">VISIT</div>
			<p class="text-white mb-4">{slice.primary.address||""}</p>
			<div class="button-text text-white">CALL</div>
			<p class="text-white mb-4">{slice.primary.phone_number||""}</p>
			<div class="button-text text-white">MESSAGE</div>
			<p class="text-white">{slice.primary.email||""}</p>
		</div>
		<form class="w-2/3 flex flex-col gap-8 pl-16" name="contact" method="POST" action='/contact'>
			<h5 class="text-white">{slice.primary.eyebrow||""}</h5>
			<div class="w-full flex flex-row justify-between">
				<input type="email" name="email" placeholder="Your Email" class="w-[45%]" />
				<select name="interest" class="w-[45%] cursor-pointer" placeholder="Select Interest">
					<option class="text-gr">Select Interest</option>
					<option value="Leasing">Leasing</option>
					<option value="Investor Relations">Investor Relations</option>
					<option value="Leasing">Property Sales and Acquisition</option>
				</select>

			</div>
			<div class="w-full">
				<textarea name="message" class="w-full h-48" placeholder="Your Message" />
			</div>
			<button class="hover:bg-erp-blue border-white border-2 text-white active:bg-black w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2" 
					type="submit">
					SUBMIT
			</button>

		</form>
	</ContentWidth>
	
</section>
