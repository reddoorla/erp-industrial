<script lang="ts">
    export let text = "BUTTON";
    export let filled = true;
</script>

<style>
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


<button on:click
        class="{filled ?
         "bg-black hover:bg-erp-blue active:bg-black  text-white" 
         : 
         "hover:bg-erp-blue border-white border-2 text-white active:bg-black " 
         } w-full md:w-fit text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2 {$$props.class || ''}">
        {text}
</button>