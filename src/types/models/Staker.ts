// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type StakerProps = Omit<Staker, NonNullable<FunctionPropertyNames<Staker>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatStakerProps = Omit<StakerProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Staker implements CompatEntity {

    constructor(
        
        id: string,
    ) {
        this.id = id;
        
    }

    public id: string;
    public pool?: string;
    public staker?: string;
    public stakeAmount?: bigint;
    public mintAmount?: bigint;
    

    get _name(): string {
        return 'Staker';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Staker entity without an ID");
        await store.set('Staker', id.toString(), this as unknown as CompatStakerProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Staker entity without an ID");
        await store.remove('Staker', id.toString());
    }

    static async get(id: string): Promise<Staker | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Staker entity without an ID");
        const record = await store.get('Staker', id.toString());
        if (record) {
            return this.create(record as unknown as StakerProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<StakerProps>[], options: GetOptions<StakerProps>): Promise<Staker[]> {
        const records = await store.getByFields<CompatStakerProps>('Staker', filter  as unknown as FieldsExpression<CompatStakerProps>[], options as unknown as GetOptions<CompatStakerProps>);
        return records.map(record => this.create(record as unknown as StakerProps));
    }

    static create(record: StakerProps): Staker {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
        );
        Object.assign(entity,record);
        return entity;
    }
}
