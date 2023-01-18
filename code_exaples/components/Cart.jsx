import { ArrowRightIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  StackDivider,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { numberWithCommas } from "../../libs/numberWithCommas";
import sendCartData from "../../store/pos-action";
import { posActions } from "../../store/pos-slice";
import OrderCheckOutModal from "../modals/OrderCheckOutModal";
import CartItem from "./CartItem";

function Cart({ store, ssm = false, limit }) {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const aToken = useSelector((state) => state.auth.aToken);
  const uiText = useSelector((state) => state.ui.text);
  const cartItems = useSelector((state) => state.pos.cartItems);
  const cartQty = useSelector((state) => state.pos.cartQty);
  const orderSendingStatus = useSelector(
    (state) => state.pos.orderSendingStatus
  );
  const cartTotalAmount = useSelector((state) => state.pos.cartTotalAmount);
  const processingOrderId = useSelector(
    (state) => state.order.processingOrderId
  );

  useEffect(() => {
    processingOrderId && onOpen();
  }, [onOpen, processingOrderId]);

  function onSubmitHandler() {
    dispatch(sendCartData(aToken, store, cartItems));
  }

  function onResetCartHandler() {
    dispatch(posActions.resetCart());
  }
  return (
    <>
      <OrderCheckOutModal isOpen={isOpen} onClose={onClose} ssm={ssm} />
      <Stack
        boxShadow={"2xl"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        p={6}
        spacing={4}
      >
        <Stack spacing={0} px={3}>
          <HStack>
            <Heading as="h3" size="lg">
              {uiText.cart}
            </Heading>
            <Tag size={"lg"} variant="solid" rounded={"2xl"}>
              {cartQty}
            </Tag>
          </HStack>
          {ssm && (
            <Text fontSize="lg" color={"gray.500"}>
              {uiText.limit}: {numberWithCommas(limit)}
            </Text>
          )}
        </Stack>
        <Stack
          spacing={4}
          divider={<StackDivider borderColor={"gray.100"} />}
          overflowY="scroll"
          maxH={ssm ? "51vh" : "55vh"}
          minH={ssm ? "51vh" : "55vh"}
        >
          {cartItems &&
            cartItems.map((i) => (
              <CartItem key={i.name} item={i} ssm={ssm} limit={limit} />
            ))}
        </Stack>
        <HStack textAlign="center">
          <Heading as="h3" size="lg" color={"gray.500"}>
            {uiText.total}:
          </Heading>
          <Heading as="h3" size="lg">
            {numberWithCommas(cartTotalAmount)}
          </Heading>
        </HStack>
        <HStack align={"center"} justifyContent="space-around">
          <Button
            onClick={onResetCartHandler}
            disabled={cartQty === 0 || orderSendingStatus !== ""}
            leftIcon={<RepeatIcon />}
            colorScheme="orange"
            variant={"outline"}
          >
            {uiText.clear}
          </Button>
          <Button
            onClick={onSubmitHandler}
            isLoading={orderSendingStatus !== ""}
            disabled={cartQty === 0 || orderSendingStatus !== ""}
            leftIcon={<ArrowRightIcon />}
            colorScheme={orderSendingStatus === "e" ? "red" : "orange"}
          >
            {uiText.checkout}
          </Button>
        </HStack>
      </Stack>
    </>
  );
}

export default Cart;
