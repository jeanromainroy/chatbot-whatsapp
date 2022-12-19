<script>

    // properties
    export let text;
    export let disabled = false;
    export let onclick;

    // onclick
    function _onclick(){
        if(typeof(onclick) === 'function'){
            onclick();
        }
    }

</script>

<div>
    <button on:click={() => { _onclick() }} disabled={disabled}>{text}</button>
</div>

<style>

    div{
        text-align: center;
    }

    button{
        cursor: pointer;
        margin: 0 0.5em 0;
        padding: 0.5em 1em;
    }

</style>