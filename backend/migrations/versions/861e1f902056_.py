"""empty message

Revision ID: 861e1f902056
Revises: 7eef106c05a8
Create Date: 2020-06-10 14:24:40.151933

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '861e1f902056'
down_revision = '7eef106c05a8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('name', sa.String(), nullable=True))

    op.execute('UPDATE users SET name=0 WHERE name IS NULL;')

    op.alter_column('users', 'name', nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'name')
    # ### end Alembic commands ###
