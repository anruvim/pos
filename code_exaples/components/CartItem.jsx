import { AddIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  ScaleFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { numberWithCommas } from "../../libs/numberWithCommas";
import { posActions } from "../../store/pos-slice";
import { addItemToCart } from "../../store/pos-action";

function CartItem({ item, ssm = false, limit }) {
  const dispatch = useDispatch();
  const uiText = useSelector((state) => state.ui.text.cart);
  const cartTotal = useSelector((state) => state.pos.cartTotalAmount);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  function onAddHandler() {
    dispatch(addItemToCart(item, cartTotal, ssm, limit, uiText.limitMessage));
  }

  function onRemHandler() {
    dispatch(posActions.removeItemFromCart(item.name));
  }

  return (
    <ScaleFade initialScale={0.8} in={true}>
      <Stack
        direction={"row"}
        spacing={4}
        align={"center"}
        justifyContent="space-between"
      >
        <Avatar size="lg" src={item.img} alt={item.name}>
          <AvatarBadge
            boxSize="1.5em"
            bg={useColorModeValue("orange.300", "orange.700")}
          >
            <Text
              color={useColorModeValue("gray.700", "gray.300")}
              fontSize="lg"
              fontWeight="700"
            >
              {item.qty}
            </Text>
          </AvatarBadge>
        </Avatar>
        <Box flex="1">
          <Stack direction={"column"} spacing={0} fontSize={"lg"}>
            <Text fontWeight={600}>{item.name}</Text>
            <Text color={"gray.500"}>{numberWithCommas(item.totalPrice)}</Text>
          </Stack>
        </Box>
        <Stack direction={"column"} spacing={0}>
          <IconButton
            onClick={onAddHandler}
            size="sm"
            variant="solid"
            colorScheme="green"
            icon={<AddIcon />}
            roundedBottom={0}
            _focus={{ outline: "none" }}
          />
          <IconButton
            onClick={onRemHandler}
            size="sm"
            variant="solid"
            colorScheme="red"
            icon={item.qty > 1 ? <MinusIcon /> : <CloseIcon />}
            roundedTop={0}
            _focus={{ outline: "none" }}
          />
        </Stack>
      </Stack>
    </ScaleFade>
  );
}

export default CartItem;
