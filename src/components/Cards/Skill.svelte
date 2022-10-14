<script lang="ts">
    import Icon from "../helpers/Icon.svelte";
    import SecondaryButton from "../Buttons/Secondary.svelte";

    interface SkillCardProps {
        title: string;
        description: string;
        icon: {
            name: string;
            type: "material" | "custom";
            width?: number | string;
            height?: number | string;
            href?: string;
        };
        endpoint: string;
        border?: {
            color: string;
            caption: string;
        };
    }
    export let props: SkillCardProps;
    const {
        title,
        description,
        icon,
        border,
        endpoint
    } = props;
</script>

<div
    class="card" 
    style="border: {border ? `1px solid ${border.color}` : "none"}"
    id={title}
>
    {#if border}
        <span class="caption" style="color: {border.color}">{border.caption}</span>
    {/if}
    <div class="top">
        <p class="title">{title}</p>
        <div class="icon">
            {#if icon.type === "custom"}
                <div
                    on:click={(e) => {
                        if(!icon.href) return;
                        e.preventDefault();
                        window.open(icon.href, "_blank");
                    }}
                    style="cursor: {icon.href ? "pointer" : "default"}"
                >
                    <Icon
                        name={icon.name}
                        width={icon?.width || "20"}
                        height={icon.height || "20"}
                    />
                </div>
            {:else if icon.type === "material"}
                <div
                    on:click={(e) => {
                        if(!icon.href) return;
                        e.preventDefault();
                        window.open(icon.href, "_blank");
                    }}
                    style="cursor: {icon.href ? "pointer" : "default"}"
                >
                    <i class="material-icons">{icon.name}</i>
                </div>
            {/if}
        </div>
    </div>
    <div class="body">
        <p class="description text-xs">{@html description}</p>
    </div>
    <div class="bottom">
        <SecondaryButton
            props={{
                text:"Projects",
                handleClick: () => {
                    window.location.href = endpoint;
                },
                size:"sm",
                align:"right",
                padded: false,
                title: `View my projects that used ${title}`
            }}
        />
    </div>
</div>

<style lang="scss">
    @use "../../styles/variables" as *;

    .card {
        // width: 100%;
        // height: 150px;
        background-color: #fff;
        box-shadow: .2px 10px 36px rgba($color: #000000, $alpha: .12);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // cursor: pointer;
        position: relative;
        transition: all 0.2s ease-in-out;
        padding-inline: 24px;
        padding-block: 14px;

        &:hover {
            box-shadow: .2px 10px 36px rgba($color: #000000, $alpha: .2);
        }

        .caption {
            position: absolute;
            top: -24px;
            left: 0;
            font-size: 12px;
            color: $accent;
        }

        .title {
            margin: 0;
            padding: 4px 0;
        }

        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;

            p {
                font-size: 20px;
                font-weight: 500;
                margin: 0;
            }
        }

        .body {
            text-align: left;
        }

        .bottom {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
</style>