<script lang="ts">

  let { text = "BUTTON", filled = true, href = "", ...rest, class: className = "" }: { text?: unknown; filled?: unknown; href?: unknown; [key: string]: unknown; class?: string } = $props();
</script>

<style>
    button, a{

        font-size: 10px;

letter-spacing: 2px;
text-transform: uppercase;
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
        button, a{
            font-style: normal;
            font-weight: 500;
            text-align: center;
            border-radius: 3px;
            padding: 10px;
        }
    }


</style>
{#if href}
<a      {href}
        class="{filled ?
         "bg-black hover:bg-erp-blue active:bg-black  text-white" 
         : 
         "hover:bg-erp-blue border-white border-2 text-white active:bg-black " 
         } w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2 {className || ''}">
        {text}
</a>

{:else}
<button on:click
        class="{filled ?
         "bg-black hover:bg-erp-blue active:bg-black  text-white" 
         : 
         "hover:bg-erp-blue border-white border-2 text-white active:bg-black " 
         } w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2 {className || ''}">
        {text}
</button>
{/if}