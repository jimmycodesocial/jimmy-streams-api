-----------------------------------------------------------------------------------------------------------------------
-- findSubscribers Function
-- Returns the "id" property of all the streams "subscribed_to" another stream
-- PARAMETERS:
--   * starter: The Stream Id
--   * notification: The edge have to be from notification or not
--   * offset: Pagination control, use with SKIP
--   * quantity: Pagination control, use with LIMIT
-----------------------------------------------------------------------------------------------------------------------
DELETE FROM OFunction where name = 'findSubscriptions';

CREATE FUNCTION findSubscriptions
"SELECT EXPAND(out) FROM SUBSCRIBED_TO WHERE in.id = :starter AND notify = :notification skip :offset limit :quantity;"
PARAMETERS [starter, notification, offset, quantity] IDEMPOTENT true LANGUAGE sql

SELECT EXPAND(out) FROM SUBSCRIBED_TO WHERE in.id = :starter AND notify = :notification skip :offset limit :quantity
