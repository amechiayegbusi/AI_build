import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
} from 'sequelize';
import SequelizeAttributes from 'utils/SequelizeAttributes';
import db from './_instance';
import Ticket from './ticket';
import Transaction from './transaction';

class Terminal extends Model<InferAttributes<Terminal>, InferCreationAttributes<Terminal>> {
  declare id: CreationOptional<number>;

  declare idAgent: number | null;

  declare number: string | null;

  declare machineNo: string;

  declare location: string | null;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
  
  declare deletedAt: CreationOptional<Date>;

  declare tickets: NonAttribute<Ticket[]>;

  declare static associations: {
    tickets: Association<Terminal, Ticket>;    
  };
}

Terminal.init(
  {
    ...SequelizeAttributes.Terminal,
  },
  {
    sequelize: db.sequelize as any,
    paranoid: true,
    tableName: 'Terminal',
  }
);

Terminal.hasMany(Ticket, {
  sourceKey: 'id',
  foreignKey: 'idTerminal',
  as: 'tickets',
});

Ticket.belongsTo(Terminal, {
  targetKey: 'id',
  foreignKey: 'idTerminal',
  as: 'terminal',
  constraints: false,
});

Terminal.hasMany(Transaction, {
  sourceKey: 'id',
  foreignKey: 'idTerminal',
  as: 'transactions',
});

export default Terminal;
