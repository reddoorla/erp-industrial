<script lang="ts">
	import Nav from "$lib/components/Nav.svelte";

const buildoutHTML = `
  <div id="buildout"  style="max-width:1440px; margin:auto; height:80vh;"></div>
  <script type="text/javascript" src="//buildout.com/api.js?v8"><\/script>
  <script type="text/javascript">
    BuildOut.embed({
      token: "bdecc802689ae7f3e2007fdaf2ffdb31f711a99e",
      plugin: "inventory",
      target: "buildout"
    });
  <\/script>
`;
</script>

<svelte:head>
    <title>ERP Properties</title>
</svelte:head>
<div class="w-screen h-screen bg-white fixed top-0"> 
    <Nav isLogoLarge={false}/>
<div class="mt-[20vh]">
    {@html buildoutHTML}
</div>
</div>  