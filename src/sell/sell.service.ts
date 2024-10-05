import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Item, Sell, SellItem } from 'database/types';
import { Knex } from 'knex';
import {
  From,
  Id,
  Limit,
  Page,
  PaginationReturnType,
  Search,
  To,
} from 'src/types/global';
import { UpdateSellDto } from './dto/update-sell.dto';
import { AddItemToSellDto } from './dto/add-item-to-sell.dto';
import { UpdateItemToSellDto } from './dto/update-item-to-sell';
import { ItemService } from 'src/item/item.service';
import * as PDFDocument from 'pdfkit';
import * as JsBarcode from 'jsbarcode';
import { Canvas } from 'canvas';
import { Response } from 'express';
import { generatePaginationInfo, timestampToDateString } from 'lib/functions';
import { RestoreSellDto } from './dto/restore-sell.dto';

@Injectable()
export class SellService {
  constructor(
    @Inject('KnexConnection') private readonly knex: Knex,
    private itemService: ItemService,
  ) {}
  generateBarcode(value) {
    const canvas = new Canvas(60, 60, 'image');
    JsBarcode(canvas, value);
    return canvas.toBuffer();
  }
  async getAll(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Sell[]>> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id') // Join for updated_by
        .offset((page - 1) * limit)
        .where('sell.deleted', false)

        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('sell.created_at', [fromDate, toDate]);
          }
        })
        .limit(limit)
        .orderBy('sell.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Sell>(
        this.knex<Sell>('sell'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: sells,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: sells.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Sell[]>> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id') // Join for updated_by
        .offset((page - 1) * limit)
        .where('sell.deleted', true)
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('sell.created_at', [fromDate, toDate]);
          }
        })
        .limit(limit)
        .orderBy('sell.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Sell>(
        this.knex<Sell>('sell'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: sells,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: sells.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<Sell[]> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id') // Join for updated_by
        .where(function () {
          this.whereRaw('CAST(sell.id AS TEXT) ILIKE ?', [`%${search}%`]);
        })
        .andWhere('sell.deleted', false)
        .limit(30);

      return sells;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<Sell[]> {
    try {
      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id') // Join for updated_by
        .where(function () {
          this.whereRaw('CAST(sell.id AS TEXT) ILIKE ?', [`%${search}%`]);
        })
        .andWhere('sell.deleted', true)
        .limit(30);

      return sells;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOne(id: Id): Promise<Sell> {
    try {
      const sell: Sell = await this.knex<Sell>('sell')
        .select(
          'sell.*',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('user as createdUser', 'sell.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'sell.updated_by', 'updatedUser.id') // Join for updated_by
        .where('sell.id', id)
        .andWhere('sell.deleted', false)
        .first();

      return sell;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSellItems(sell_id: Id): Promise<SellItem[]> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .where('sell_item.sell_id', sell_id)
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', false);

      return sellItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDeletedSellItems(sell_id: Id): Promise<SellItem[]> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .where('sell_item.sell_id', sell_id)
        .andWhere('sell_item.deleted', true)
        .andWhere('sell_item.self_deleted', true);

      return sellItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSelfDeletedSellItems(
    page: Page,
    limit: Limit,
  ): Promise<PaginationReturnType<SellItem[]>> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', true)
        .offset((page - 1) * limit)
        .limit(limit);

      const { hasNextPage } = await generatePaginationInfo<SellItem>(
        this.knex<SellItem>('sell_item'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: sellItems,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: sellItems.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async searchSelfDeletedSellItems(search: Search): Promise<SellItem[]> {
    try {
      const sellItems: SellItem[] = await this.knex<SellItem>('sell_item')
        .select(
          'sell_item.*',
          'item.id as item_id',
          'item.name as item_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .leftJoin(
          'user as createdUser',
          'sell_item.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'sell_item.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', true)
        .andWhere(function () {
          this.whereRaw('CAST(sell_id AS TEXT) ILIKE ?', [`%${search}%`]);
        });
      return sellItems;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async create(user_id: number): Promise<Sell> {
    try {
      const sell: Sell[] = await this.knex<Sell>('sell')
        .insert({
          date: new Date(),
          discount: 0,
          created_by: user_id,
        })
        .returning('*');

      return sell[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async print(sell_id: Id, res: Response): Promise<void> {
    try {
      const today = new Date();

      // Get the year, month, and day
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();

      const hours = today.getHours();
      const minutes = today.getMinutes();

      const formattedDate = `${year} - ${month} - ${day} ${hours}:${minutes}`;

      let sell: Sell = await this.findOne(sell_id);

      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .select('sell_item.*', 'item.id as item_id', 'item.name as item_name')
        .leftJoin('item', 'sell_item.item_id', 'item.id')
        .where('sell_item.sell_id', sell_id)
        .andWhere('sell_item.deleted', false);

      if (sellItem.length > 0) {
        const margin = 15;
        const rowHeight = 20;
        const pageWidth = 210;

        const columnWidthss = {
          'کاڵا ناوی': 80,
          عەدەد: 40,
          نرخ: 40,
          کۆ: 40,
        };
        const tableTop = 80; // Starting vertical position for the table
        const tableBorderHeight =
          rowHeight * (sellItem.length + 1) + (sellItem.length + 1) * 5;
        const dateYPosition = tableTop + tableBorderHeight + 10;
        const extraBottomSpace = 130; // Extra space for barcode and margin
        const totalHeight =
          tableTop +
          (sellItem.length + 1) * rowHeight +
          extraBottomSpace +
          (sellItem.length + 1) * 5;

        let doc: PDFKit.PDFDocument = new PDFDocument({
          size: [213, totalHeight],
          margin: 15,
        });
        doc.font('assets/kurdish.TTF');

        doc
          .image('assets/logo.jpg', 18, 18, { width: 25 })
          .fontSize(9)

          .text('غەسلی ڕەها', {
            features: ['rtla'],
            align: 'right',
          })
          .fontSize(7)
          .text('بۆ خزمەتگوزاری غەسلی ئۆتۆمبێڵ', {
            features: ['rtla'],
            align: 'right',
          })
          .text('07501167153 - 07701993085', {
            features: ['rtla'],
            align: 'right',
          })
          .moveDown(0.5);
        //title
        doc.rect(12, 12, 190, 40).stroke();
        doc
          .fontSize(9.2)
          .lineGap(2)
          .stroke()
          .text(`${sell_id}       ر.وصل`, {
            align: 'right',
          })
          .moveDown(0.7);
        //wasl
        doc.rect(12, 55, 190, 20).stroke();
        doc.rect(167, 55, 35, 20).stroke();

        // Define table columns and positions

        doc.fontSize(9);

        let currentX = pageWidth - margin;
        const columnWidths = {
          itemName: 60,
          quantity: 40,
          price: 40,
          total: 40,
        };
        // Render columns from right to left
        ['کاڵا ناوی', 'عەدەد', 'نرخ', 'کۆ'].forEach((header) => {
          currentX -= columnWidthss[header];
          doc.text(header, currentX, tableTop, {
            width: columnWidthss[header],
            align: 'right',
          });
        });
        // Function to split text into lines based on column width
        const splitText = (
          text: string,
          width: number,
          fontSize: number,
        ): string[] => {
          const lines: string[] = [];
          let currentLine = '';
          const words = text.split(' ');

          words.forEach((word) => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const widthOfLine = doc.widthOfString(testLine);

            if (widthOfLine > width) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });

          if (currentLine) {
            lines.push(currentLine);
          }

          return lines;
        };
        doc
          .moveTo(15, tableTop + rowHeight)
          .lineTo(195, tableTop + rowHeight)
          .stroke();
        // Render each row of the table
        sellItem.forEach((item: SellItem, index) => {
          const y = tableTop + (index + 1) * rowHeight;
          const lines = splitText(
            item.item_name,
            columnWidthss['کاڵا ناوی'],
            9,
          );

          lines.forEach((line, lineIndex) => {
            doc
              .fontSize(9)
              .text(
                line,
                pageWidth - margin - columnWidthss['کاڵا ناوی'],
                y + lineIndex * 10,
                {
                  width: columnWidthss['کاڵا ناوی'],
                  align: 'right',
                  lineBreak: false, // Disable automatic line breaking
                },
              );
          });

          doc
            .fontSize(9)
            .text(
              item.quantity.toString(),
              pageWidth -
                margin -
                columnWidthss['کاڵا ناوی'] -
                columnWidthss['عەدەد'],
              y,
              {
                width: columnWidthss['عەدەد'],
                align: 'right',
              },
            )
            .text(
              item.item_sell_price.toFixed(0),
              pageWidth -
                margin -
                columnWidthss['کاڵا ناوی'] -
                columnWidthss['عەدەد'] -
                columnWidthss['نرخ'],
              y,
              {
                width: columnWidthss['نرخ'],
                align: 'right',
              },
            )
            .text(
              (item.quantity * item.item_sell_price).toFixed(0),
              pageWidth -
                margin -
                columnWidthss['کاڵا ناوی'] -
                columnWidthss['عەدەد'] -
                columnWidthss['نرخ'] -
                columnWidthss['کۆ'],
              y,
              {
                width: columnWidthss['کۆ'],
                align: 'right',
              },
            );
        });
        // Draw final table border
        doc.rect(10, tableTop - 5, 193, tableBorderHeight).stroke();
        // Print the formatted date
        doc.text(`داشکاندن : ${sell.discount}`, 10, dateYPosition, {
          align: 'center',
          continued: true,
          // Position the date below the table
          indent: 10, // Align text to the right margin with extra space
          baseline: 'alphabetic', // Adjust baseline if needed
          width: 193, // Ensure it fits within the page width
          paragraphGap: 10, // Additional space after the text
          // Positioning
        });

        doc.text(
          `گشتی کۆی : ${(
            sellItem?.reduce((accumulator: number, val: SellItem) => {
              return accumulator + Number(val.item_sell_price) * val.quantity;
            }, 0) - Number(sell?.discount)
          ).toFixed(0)}`,
          10,
          dateYPosition + 20,
          {
            align: 'left',
            continued: true,
            // Position the date below the table
            indent: 10, // Align text to the right margin with extra space
            baseline: 'alphabetic', // Adjust baseline if needed
            width: 193, // Ensure it fits within the page width
            paragraphGap: 10, // Additional space after the text
            // Positioning
          },
        );

        doc.text(formattedDate, 10, dateYPosition + 40, {
          align: 'right',
          continued: true,
          // Position the date below the table
          indent: 10, // Align text to the right margin with extra space
          baseline: 'alphabetic', // Adjust baseline if needed
          width: 193, // Ensure it fits within the page width
          paragraphGap: 10, // Additional space after the text
          // Positioning
        });

        doc.image(this.generateBarcode(sell_id), 10, totalHeight - 50, {
          width: 30,
          align: 'center',
        });

        //border
        doc.rect(5, 5, 203, totalHeight - 10).stroke();
        doc.end();

        doc.pipe(res);
      } else {
        throw new BadRequestException('مواد داخڵ کە بۆ سەر وەصڵ');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addItemToSell(
    sell_id: Id,
    body: AddItemToSellDto,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let actualItemId;
      if (body.barcode) {
        let item = await this.knex<Item>('item')
          .where('barcode', body.item_id)
          .first();
        if (!item) {
          throw new BadRequestException('ئەم مەوادە لە کۆگا نیە');
        } else {
          actualItemId = item.id;
        }
      } else {
        actualItemId = body.item_id;
      }
      let itemQuantity = await this.itemService.getItemQuantity(
        Number(actualItemId),
      );
      if (1 > itemQuantity.actual_quantity) {
        throw new BadRequestException(
          'ناتوانی ئەم عەدەدە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let initialSell: Sell;
      let actual_id: Id;
      if (sell_id == 0) {
        initialSell = await this.create(user_id);
        actual_id = initialSell.id;
      } else {
        actual_id = sell_id;
      }

      let exists = await this.knex<SellItem>('sell_item')
        .where('sell_id', actual_id)
        .andWhere('item_id', Number(actualItemId))
        .andWhere('deleted', false)
        .first();

      if (exists) {
        return this.increaseItemInSell(sell_id, Number(actualItemId), user_id);
      }
      let item: Pick<Item, 'id' | 'item_purchase_price' | 'item_sell_price'> =
        await this.knex<Item>('item')
          .select('id', 'item_purchase_price', 'item_sell_price')
          .where('id', actualItemId)
          .first();
      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .insert({
          sell_id: actual_id,
          item_id: Number(actualItemId),
          created_by: user_id,
          quantity: 1,
          item_purchase_price: item.item_purchase_price,
          item_sell_price: item.item_sell_price,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateItemInSell(
    sell_id: Id,
    item_id: Id,
    body: UpdateItemToSellDto,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let itemQuantity = await this.itemService.getItemQuantity(item_id);
      if (body.quantity > itemQuantity.actual_quantity) {
        throw new BadRequestException(
          'ناتوانی ئەم عەدەدە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let prevQuantity: Pick<SellItem, 'id' | 'quantity'> =
        await this.knex<SellItem>('sell_item')
          .where('sell_id', sell_id)
          .andWhere('item_id', item_id)
          .andWhere('deleted', false)
          .andWhere('self_deleted', false)
          .first();
      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('deleted', false)
        .andWhere('self_deleted', false)
        .update({
          quantity: Number(prevQuantity.quantity) + Number(body.quantity),
          updated_by: user_id,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async increaseItemInSell(
    sell_id: Id,
    item_id: Id,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let itemQuantity = await this.itemService.getItemQuantity(item_id);
      if (itemQuantity.actual_quantity == 0) {
        throw new BadRequestException(
          'ناتوانی ئەم عەدەدە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let previousItemData: Pick<SellItem, 'id' | 'quantity'> =
        await this.knex<SellItem>('sell_item')
          .select('id', 'quantity')
          .where('sell_id', sell_id)
          .andWhere('item_id', item_id)
          .andWhere('deleted', false)
          .andWhere('self_deleted', false)
          .first();

      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('deleted', false)
        .andWhere('self_deleted', false)
        .update({
          quantity: Number(previousItemData.quantity) + 1,
          updated_by: user_id,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async decreaseItemInSell(
    sell_id: Id,
    item_id: Id,
    user_id: number,
  ): Promise<SellItem> {
    try {
      let itemQuantity = await this.itemService.getItemQuantity(item_id);
      if (itemQuantity.actual_quantity == 0) {
        throw new BadRequestException(
          'ناتوانی ئەم عەدەدە زیادکەی، بڕی پێویست نیە لە کۆگا',
        );
      }
      let previousItemData: Pick<SellItem, 'id' | 'quantity'> =
        await this.knex<SellItem>('sell_item')
          .select('id', 'quantity')
          .where('sell_id', sell_id)
          .andWhere('item_id', item_id)
          .andWhere('deleted', false)
          .andWhere('self_deleted', false)

          .first();

      const sellItem: SellItem[] = await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('deleted', false)
        .andWhere('self_deleted', false)

        .update({
          quantity: Number(previousItemData.quantity) - 1,
          updated_by: user_id,
        })
        .returning('*');

      return sellItem[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteItemInSell(sell_id: Id, item_id: Id): Promise<Id> {
    try {
      await this.knex<SellItem>('sell_item')
        .where('sell_id', sell_id)
        .andWhere('item_id', item_id)
        .andWhere('self_deleted', false)
        .update({ self_deleted: true });

      return item_id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async update(id: Id, body: UpdateSellDto, user_id: number): Promise<Sell> {
    try {
      let prevSellPrice: { total_sell_price: number | string } =
        await this.knex<SellItem>('sell_item')
          .where('sell_id', id)
          .sum({
            total_sell_price: this.knex.raw('item_sell_price * quantity'),
          })
          .first();

      if (
        Number(body.discount) > Number(prevSellPrice.total_sell_price) ||
        Number(body.discount) < 0
      ) {
        throw new BadRequestException('تکایە بڕێ داشکاندنی ڕاست و دروست بنێرە');
      }
      const sell: Sell[] = await this.knex<Sell>('sell')
        .where('id', id)
        .andWhere('deleted', false)
        .update({ discount: Number(body.discount), updated_by: user_id })
        .returning('*');

      if (!sell) {
        throw new BadRequestException(`تکایە سەرەتا وەصڵ دروست بکە`);
      }

      return sell[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async delete(id: Id): Promise<Id> {
    try {
      await this.knex<Sell>('sell').where('id', id).update({ deleted: true });

      //delete all sell_items with this sell_id

      await this.knex<SellItem>('sell_item')
        .where('sell_id', id)
        .update({ deleted: true, self_deleted: true });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restore(id: Id, body: RestoreSellDto): Promise<Id> {
    try {
      await this.knex<Sell>('sell').where('id', id).update({ deleted: false });
      // Restore only the selected sell_items based on the provided item_ids
      if (body.item_ids && body.item_ids.length > 0) {
        await this.knex<SellItem>('sell_item')
          .whereIn('item_id', body.item_ids) // Only restore items with the ids in item_ids
          .andWhere('sell_id', id)
          .update({ deleted: false, self_deleted: false });
      }
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreSelfDeletedSellItem(id: Id): Promise<Id> {
    try {
      await this.knex<SellItem>('sell_item')
        .where('item_id', id)
        .update({ deleted: false, self_deleted: false });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
