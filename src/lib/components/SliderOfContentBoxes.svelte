<script lang='ts'>
    import { onMount } from "svelte";
    import { swipe } from 'svelte-gestures'
    import ContentBox from "./ContentBox.svelte";
    import type { ComponentProps } from "svelte";

  
    export let contentBoxPropsArray: ComponentProps<ContentBox>[] = [
      {
        icon: "",
        float: "left",
        titleText: "Generic Content",
        paragraphText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
      },
      {
        icon: "",
        float: "left",
        titleText: "Generic Content 2",
        paragraphText: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
      }
    ];
  

    const SLIDER_INTERVAL_IN_MS = 5000;
    let sliderIndex = 0;
    let sliderInterval: NodeJS.Timeout;
    let sliderWidth = 100 / contentBoxPropsArray.length / 5;
    let isSlideAnimated = true;

  
    const resetSlider = () => {
      setTimeout(() => isSlideAnimated = false, 500);
      setTimeout(() => sliderIndex = contentBoxPropsArray.length, 520);
      setTimeout(() => isSlideAnimated = true, 540);
    }
  
    const slideLeft = () => {
        sliderIndex++;
        clearInterval(sliderInterval);
	    sliderInterval = setInterval(()=>slideLeft(), SLIDER_INTERVAL_IN_MS);
        if(sliderIndex%contentBoxPropsArray.length==0&&sliderIndex!==0) 
            resetSlider();
    }
  
    const slideRight = () => {
      sliderIndex--;
      clearInterval(sliderInterval);
      
	sliderInterval = setInterval(()=>slideRight(), SLIDER_INTERVAL_IN_MS);
    if(sliderIndex%contentBoxPropsArray.length==0&&sliderIndex!==0 && sliderIndex<0)
        resetSlider();

        console.log(sliderIndex);
    }

    const handleSwipe = (e:CustomEvent<{ direction: "left" | "top" | "right" | "bottom"; target: EventTarget; }>) => {
      if(e.detail.direction==="left") 
        slideLeft();

        if(e.detail.direction==="right") 
        slideRight();
    }
  
    onMount(() => {
      sliderInterval = setInterval(() => slideLeft(), SLIDER_INTERVAL_IN_MS);
    });
  
    const quintupledPropsArray = [...contentBoxPropsArray, ...contentBoxPropsArray, ...contentBoxPropsArray, ...contentBoxPropsArray, ...contentBoxPropsArray];
  </script>
  
  <div class="w-full h-full relative overflow-hidden">
    <div class="flex flex-row flex-nowrap  {isSlideAnimated ? 'transition-transform duration-500 ease-in-out' : ''}" style="width: {quintupledPropsArray.length * 100}%; transform: translateX(-{(sliderIndex+contentBoxPropsArray.length) * sliderWidth}%);">
      {#each quintupledPropsArray as contentBoxProps}
        <div class="h-full z-0" style="width: {sliderWidth}%;">
          <ContentBox {...contentBoxProps} class="text-white"/>
        </div>
      {/each}
    </div>
    <div class=" h-6 w-full flex justify-between z-10 absolute bottom-0 lg:bottom-[20%] xl:bottom-[30%] left-0">
      <button on:click={slideRight} class="text-white flex align-middle justify-center cursor-pointer transition-all duration-300 active:-translate-y-2  hover:text-black">
        <i class="fa-sharp fa-solid fa-chevron-left fa-2x"/>
      </button>
      <div class="h-10 flex align-middle justify-start ">
        {#each  contentBoxPropsArray as image, i}
            <button class="h-[10px] w-[10px] border-2  rounded-full transition-colors duration-1000 cursor-pointer active:-translate-y-[0.5px] hover:opacity-60 mr-4 
            {(sliderIndex%contentBoxPropsArray.length>=0&&sliderIndex%contentBoxPropsArray.length===i)|| (sliderIndex%contentBoxPropsArray.length<=0&&contentBoxPropsArray.length+sliderIndex%contentBoxPropsArray.length===i) ? "bg-dark border-dark" : "border-light bg-light"}"
                on:click={()=>sliderIndex=i}
                aria-label="image {i} of {contentBoxPropsArray.length}"
                aria-hidden
            ></button>
        {/each}
    </div>
      <button on:click={slideLeft} class="text-white flex align-middle cursor-pointer transition-all duration-300 active:-translate-y-2 justify-center -translate-y-[5.5px] hover:text-black">
        <i class="fa-sharp fa-solid fa-chevron-right fa-2x"/>
      </button>
    </div>
  </div>
