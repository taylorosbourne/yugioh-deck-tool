import { createCard } from "../../helper/dataFactories";
import { instance, mock, when } from "ts-mockito";
import type { CardDatabase } from "@/core/lib";
import {
	createBaseModule,
	DeckPart,
	DeckService,
	DeckUriEncodingService,
	FindCardBy,
} from "@/core/lib";
import { MockCardDatabase } from "../../helper/MockCardDatabase";
import { EncodingService } from "@/core/util/EncodingService";

describe("DeckUriEncodingService", () => {
	let deckUriEncodingService: DeckUriEncodingService;

	let cardDatabaseMock: CardDatabase;

	beforeEach(() => {
		cardDatabaseMock = mock(MockCardDatabase);
		const cardDatabase = instance(cardDatabaseMock);

		const { cardService, banlistService, sortingService } =
			createBaseModule(cardDatabase);

		deckUriEncodingService = new DeckUriEncodingService(
			cardDatabase,
			new DeckService(cardService, sortingService, banlistService),
			new EncodingService()
		);
	});

	describe("toUrlQueryParamValue", () => {
		it("creates value", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });
			const card4 = createCard({ passcode: "999999999" });

			const result = deckUriEncodingService.toUrlQueryParamValue({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2, card2],
					[DeckPart.SIDE]: [card3, card4, card1, card1, card1],
				},
			});
			expect(result).toEqual("q2aAgBOMEAwCoswMDP9PzrKuBrJhGATS8vMB");
		});

		it("works with null name", () => {
			const card1 = createCard({ passcode: "123" });
			const card2 = createCard({ passcode: "456" });
			const card3 = createCard({ passcode: "789" });

			const result = deckUriEncodingService.toUrlQueryParamValue({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
			expect(result).toEqual("q2aAgBOMEFqUGUIDAA~~");
		});
	});

	describe("fromUrlQueryParamValue", () => {
		it("reads value", () => {
			const card1 = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card1);

			const card2 = createCard({ passcode: "456" });
			when(
				cardDatabaseMock.hasCard("456", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("456", FindCardBy.PASSCODE)
			).thenReturn(card2);

			const card3 = createCard({ passcode: "789" });
			when(
				cardDatabaseMock.hasCard("789", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("789", FindCardBy.PASSCODE)
			).thenReturn(card3);

			const card4 = createCard({ passcode: "999999999" });
			when(
				cardDatabaseMock.hasCard("999999999", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("999999999", FindCardBy.PASSCODE)
			).thenReturn(card4);

			const result = deckUriEncodingService.fromUrlQueryParamValue(
				"q2aAgBOMEAwCoswMDP9PzrKuBrJhGATS8vMB"
			);

			expect(result).toEqual({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2, card2],
					[DeckPart.SIDE]: [card3, card4, card1, card1, card1],
				},
			});
		});

		it("works with null name", () => {
			const card1 = createCard({ passcode: "123" });
			when(
				cardDatabaseMock.hasCard("123", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("123", FindCardBy.PASSCODE)
			).thenReturn(card1);

			const card2 = createCard({ passcode: "456" });
			when(
				cardDatabaseMock.hasCard("456", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("456", FindCardBy.PASSCODE)
			).thenReturn(card2);

			const card3 = createCard({ passcode: "789" });
			when(
				cardDatabaseMock.hasCard("789", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("789", FindCardBy.PASSCODE)
			).thenReturn(card3);

			const result = deckUriEncodingService.fromUrlQueryParamValue(
				"q2aAgBOMEFqUGUIDAA~~"
			);

			expect(result).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1],
					[DeckPart.EXTRA]: [card2],
					[DeckPart.SIDE]: [card3],
				},
			});
		});
	});

	describe("toUri", () => {
		it("creates value", () => {
			const card1 = createCard({ passcode: "5050644" });
			const card2 = createCard({ passcode: "29189613" });
			const card3 = createCard({ passcode: "38148100" });

			const result = deckUriEncodingService.toUri({
				name: "foo",
				parts: {
					[DeckPart.MAIN]: [card1, card2, card2],
					[DeckPart.EXTRA]: [card3],
					[DeckPart.SIDE]: [card1],
				},
			});
			expect(result).toEqual(
				new URL("ydke://FBFNAO1lvQHtZb0B!BBhGAg==!FBFNAA==!")
			);
		});
	});

	describe("fromUri", () => {
		it("reads value", () => {
			const card1 = createCard({ passcode: "5050644" });
			when(
				cardDatabaseMock.hasCard("5050644", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("5050644", FindCardBy.PASSCODE)
			).thenReturn(card1);

			const card2 = createCard({ passcode: "29189613" });
			when(
				cardDatabaseMock.hasCard("29189613", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("29189613", FindCardBy.PASSCODE)
			).thenReturn(card2);

			const card3 = createCard({ passcode: "38148100" });
			when(
				cardDatabaseMock.hasCard("38148100", FindCardBy.PASSCODE)
			).thenReturn(true);
			when(
				cardDatabaseMock.getCard("38148100", FindCardBy.PASSCODE)
			).thenReturn(card3);

			const result = deckUriEncodingService.fromUri(
				"ydke://FBFNAO1lvQHtZb0B!BBhGAg==!FBFNAA==!"
			);

			expect(result).toEqual({
				name: null,
				parts: {
					[DeckPart.MAIN]: [card1, card2, card2],
					[DeckPart.EXTRA]: [card3],
					[DeckPart.SIDE]: [card1],
				},
			});
		});
	});
});
