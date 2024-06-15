import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { Box, Button, Container, Flex, Heading, Input, Text, Grid, Link } from '@chakra-ui/react';

const SkeletonArticle = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded"></div>
  </div>
);

const ExtractData = (data) => {
  return data.flat().flatMap((el) => {
    const posts = el.data.search.posts.items;
    if (posts) {
      return posts.map((item) => ({
        author : item.creator.name,
        title: item.title || "Untitled",
        excerpt: item.excerpt || "No excerpt available",
        url: `https://medium.com/p/${item.id}`,
      }));
    } else {
      console.log("Unexpected data structure:", el);
      return [];
    }
  });
};

export const ScrapeForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/scrape`, {
        topic: searchQuery,
      });
      const data = response.data;
      console.log("Success:", data);
      const extractedArticles = ExtractData(data);
      console.log(extractedArticles);
      setArticles(extractedArticles.slice(0, 5));
    } catch (error) {
      console.log("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w='full' h='full' bg="gray.100" display="flex" flexDirection="column" px={6}>
      <Box as="header" w="full" py={4} display="flex" justifyContent="space-between" textAlign="center">
        <Heading as="h1" fontSize="3xl" textAlign="center" w='full'>Medium Search</Heading>
        <Box mr={4}>
          {loading && (
            <Text fontSize="xs" color="gray.400">
              Loading Time: {timer} seconds
            </Text>
          )}
        </Box>
      </Box>
      <Container maxW="container.lg" py={4}>
        <Flex align="center" justify="center" mb={4} gap={4}>
          <Input
            type="text"
            placeholder="Enter search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
            borderColor="gray.300"
            focusBorderColor="blue.500"
            flex="1"
            maxW="lg"
          />
          <Button
            onClick={handleSearch}
            isLoading={loading}
            colorScheme="blue"
            size="md"
          >
            Search
          </Button>
        </Flex>
        {loading && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {[1, 2, 3, 4, 5].map((index) => (
              <SkeletonArticle key={index} />
            ))}
          </Grid>
        )}
        {!loading && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {articles.map((article, index) => (
              <Box
                key={index}
                bg="white"
                p={4}
                rounded="lg"
                shadow="md"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: 'scale(1.05)', shadow: 'lg' }}
              >
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">{article.author}</Text>
                <Heading as="h3" fontSize="lg" fontWeight="semibold" color="gray.900">{article.title}</Heading>
                <Text fontSize="sm" color="gray.600">{article.excerpt}</Text>
                <Link
                  href={article.url}
                  isExternal
                  mt={2}
                  display="block"
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Read More
                </Link>
              </Box>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};
