<script lang="ts">
	import { _ } from 'popup/i18n';
	import { onMount } from 'svelte';

	import { getNFTs } from 'popup/backend/tokens';
  import { viewIcon } from 'lib/block-explorer/view';

	import walletStore from 'popup/store/wallet';
  import themeStore from 'popup/store/theme';

	import BottomTabs from '../components/BottomTabs.svelte';
	import TopBar from '../components/TopBar.svelte';
	import SearchBox from '../components/SearchBox.svelte';
	import NFTCard from '../components/NFTCard.svelte';

	let list = [];
	let search = '';

  $: account = $walletStore.identities[$walletStore.selectedAddress];
	$: tokens = list.filter((t) => {
		const t0 = t.name.toLowerCase().includes(search.toLowerCase());
		const t1 = t.symbol.toLowerCase().includes(search.toLowerCase());

		return t0 || t1;
	});

	onMount(async() => {
		// list = await getNFTs(account.base16);
		list = await getNFTs('0xdB407a76E832A88f19CbDbb7775de0F7b7c64951');
		console.log(list);
	});
</script>

<section>
	<TopBar
    refresh
    view
    lock
	/>
	<main>
		<SearchBox
			placeholder={$_('tokens_list.placeholder')}
			focus
			on:input={(e) => search = e.detail}
		/>
		<ul>
			{#each tokens as item}
				<li>
					<div class="header">
						<img
							height="30"
							src={viewIcon(item.bech32, $themeStore)}
							alt="logo"
						/>
						<h3>
							{item.name} ({item.symbol})
						</h3>
					</div>
					<div class="wrapper">
						{#each item.balances as token}
							<NFTCard
								url={token.url}
								id={token.tokenId}
							/>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	</main>
	<BottomTabs />
</section>

<style lang="scss">
	@import "../styles/mixins";
	main {
		@include flex-center-top-column;
	}
	main, ul {
		padding-block-start: 30px;
	}
  section {
		background-color: var(--background-color);
		@include flex-center-top-column;
	}
	ul {
		margin: 0;
		padding: 0;
    overflow-y: scroll;

		height: calc(100vh - 167px);

		@include flex-center-top-column;

		& > li {
			width: calc(100vw - 30px);
			max-width: 576px;

			@include flex-column;

			& > .header {
				margin-block-start: 15px;
				@include flex-between-row;
			}
			& > .wrapper {
				flex-wrap: wrap;

				@include flex-between-row;
				justify-content: end;
			}
		}
	}
</style>
